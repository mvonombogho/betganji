import { Prisma } from '@prisma/client';

interface QueryOptions {
  select?: Record<string, boolean | Record<string, boolean>>;
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  include?: Record<string, boolean | Record<string, any>>;
  take?: number;
  skip?: number;
}

export class QueryBuilder<T> {
  private query: any = {};

  constructor(private options: QueryOptions = {}) {
    this.query = { ...options };
  }

  select(fields: Record<string, boolean | Record<string, boolean>>) {
    this.query.select = { ...this.query.select, ...fields };
    return this;
  }

  where(conditions: Record<string, any>) {
    this.query.where = {
      AND: [
        this.query.where || {},
        conditions
      ]
    };
    return this;
  }

  orderBy(field: string, direction: 'asc' | 'desc') {
    this.query.orderBy = { [field]: direction };
    return this;
  }

  include(relations: Record<string, boolean | Record<string, any>>) {
    this.query.include = { ...this.query.include, ...relations };
    return this;
  }

  paginate(page: number, limit: number) {
    this.query.skip = (page - 1) * limit;
    this.query.take = limit;
    return this;
  }

  // Handle date range queries efficiently
  dateRange(field: string, start?: Date, end?: Date) {
    if (start || end) {
      const dateCondition: Record<string, any> = {};
      if (start) dateCondition.gte = start;
      if (end) dateCondition.lte = end;
      
      this.where({ [field]: dateCondition });
    }
    return this;
  }

  // Handle search queries with proper indexing
  search(fields: string[], term: string) {
    if (term) {
      const searchConditions = fields.map(field => ({
        [field]: { contains: term, mode: 'insensitive' as Prisma.QueryMode }
      }));
      
      this.where({ OR: searchConditions });
    }
    return this;
  }

  // Optimize related data loading
  withRelated(relation: string, subFields?: string[]) {
    const include = subFields
      ? { select: subFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}) }
      : true;
    
    this.query.include = { ...this.query.include, [relation]: include };
    return this;
  }

  // Build the final query
  build() {
    return this.query;
  }
}