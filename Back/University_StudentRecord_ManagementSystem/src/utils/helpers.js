// 工具函数集合

/**
 * 处理分页参数
 * @param {Object} req - Express请求对象
 * @returns {Object} 包含页码和每页条数的对象
 */
export function getPaginationParams(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    return {
        page,
        limit,
        offset: (page - 1) * limit
    };
}

/**
 * 封装错误处理
 * @param {Function} fn - 异步控制器函数
 * @returns {Function} 带错误处理的控制器函数
 */
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/**
 * 创建一个中间件用于处理全局错误
 */
export function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${new Date().toISOString()}:`, err.stack);
    
    // 针对特定的SQL错误提供友好消息
    let statusCode = 500;
    let errorMessage = '服务器内部错误';
    
    if (err.number) {
        // SQL Server 错误
        switch (err.number) {
            case 547:  // 外键约束违反
                statusCode = 400;
                errorMessage = '操作违反了数据完整性约束';
                break;
            case 2627: // 主键或唯一约束违反
                statusCode = 409;
                errorMessage = '记录已存在，无法添加重复数据';
                break;
            case 8152: // 字符串或二进制数据将被截断
                statusCode = 400;
                errorMessage = '输入数据过长，超出了字段允许的最大长度';
                break;
        }
    }
    
    res.status(statusCode).json({
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
}

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} - 格式化的日期字符串 YYYY-MM-DD
 */
export function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * SQL查询过滤器 - 帮助构建安全的WHERE子句
 * @param {Object} filters - 过滤条件对象
 * @param {Object} pool - 数据库连接池
 * @returns {Object} - 包含SQL WHERE子句和参数的对象
 */
export function buildSqlFilters(filters) {
    const whereConditions = [];
    const parameters = {};
    
    Object.entries(filters).forEach(([key, value], index) => {
        if (value !== undefined && value !== null && value !== '') {
            const paramName = `p${index}`;
            whereConditions.push(`${key} = @${paramName}`);
            parameters[paramName] = value;
        }
    });
    
    return {
        where: whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '',
        parameters
    };
}

/**
 * 验证输入数据的必填字段
 * @param {Object} data - 要验证的数据
 * @param {Array} requiredFields - 必填字段列表
 * @returns {Array} - 缺失字段列表，空数组表示验证通过
 */
export function validateRequired(data, requiredFields) {
    const missingFields = [];
    
    requiredFields.forEach(field => {
        if (data[field] === undefined || data[field] === null || data[field] === '') {
            missingFields.push(field);
        }
    });
    
    return missingFields;
}

/**
 * 构建分页响应对象
 * @param {Array} data - 查询结果数据
 * @param {number} total - 总记录数
 * @param {number} page - 当前页码
 * @param {number} limit - 每页条数
 * @returns {Object} 包含分页信息的响应对象
 */
export function paginatedResponse(data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    
    return {
        data,
        pagination: {
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}

/**
 * 对象属性验证器
 * @param {Object} data - 要验证的数据对象
 * @param {Object} validations - 验证规则对象
 * @returns {Object} - 验证结果，包含是否有效和错误信息
 */
export function validateObject(data, validations) {
    const errors = {};
    
    for (const [field, rules] of Object.entries(validations)) {
        const value = data[field];
        
        if (rules.required && (value === undefined || value === null || value === '')) {
            errors[field] = `${field} 是必填字段`;
            continue;
        }
        
        if (value !== undefined && value !== null) {
            // 类型验证
            if (rules.type && typeof value !== rules.type) {
                errors[field] = `${field} 必须是 ${rules.type} 类型`;
                continue;
            }
            
            // 长度验证
            if (rules.maxLength && String(value).length > rules.maxLength) {
                errors[field] = `${field} 不能超过 ${rules.maxLength} 个字符`;
            }
            
            if (rules.minLength && String(value).length < rules.minLength) {
                errors[field] = `${field} 不能少于 ${rules.minLength} 个字符`;
            }
            
            // 数值范围验证
            if (rules.min !== undefined && Number(value) < rules.min) {
                errors[field] = `${field} 不能小于 ${rules.min}`;
            }
            
            if (rules.max !== undefined && Number(value) > rules.max) {
                errors[field] = `${field} 不能大于 ${rules.max}`;
            }
            
            // 自定义验证函数
            if (rules.validate && typeof rules.validate === 'function') {
                const customError = rules.validate(value, data);
                if (customError) {
                    errors[field] = customError;
                }
            }
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}