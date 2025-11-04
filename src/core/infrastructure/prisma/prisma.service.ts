import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Prisma, PrismaClient, User } from "@prisma/client";

interface PaginationArgs {
  limit: number;
  page: number;
  includePageCount?: boolean;
  where?: any;
  orderBy?: any;
  include?: any;
  select?: any;
}

interface PaginationResult<T> {
  data: T[];
  meta?: {
    currentPage: number;
    limit: number;
    total: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Generic extended delegate that works with any Prisma model
type ExtendedDelegate<T, Delegate> = Delegate & {
  paginate(): {
    withPages(args: PaginationArgs): Promise<PaginationResult<T>>;
  };
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private extendedClient: any;

  constructor() {
    super({
      log: ["query"],
      errorFormat: "pretty",
    });

    this.extendedClient = this.$extends({
      model: {
        $allModels: {
          paginate() {
            return {
              async withPages<T>(
                args: PaginationArgs
              ): Promise<PaginationResult<T>> {
                const ctx = Prisma.getExtensionContext(this);
                const {
                  limit,
                  page,
                  includePageCount = true,
                  where,
                  orderBy,
                  include,
                  select,
                } = args;
                const skip = (page - 1) * limit;

                const [data, totalCount] = await Promise.all([
                  (ctx as any).findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy,
                    include,
                    select,
                  }),
                  includePageCount ? (ctx as any).count({ where }) : undefined,
                ]);

                const total = totalCount || 0;
                const pageCount = Math.ceil(total / limit);

                return {
                  data,
                  meta: includePageCount
                    ? {
                        currentPage: page,
                        limit,
                        total,
                        pageCount,
                        hasNextPage: page < pageCount,
                        hasPreviousPage: page > 1,
                      }
                    : undefined,
                };
              },
            };
          },
        },
      },
    });
  }

  // Type-safe accessors for each model
  get user(): ExtendedDelegate<User, Prisma.UserDelegate> {
    return this.extendedClient.user;
  }

  // get post(): ExtendedDelegate<Post, Prisma.PostDelegate> {
  //   return this.extendedClient.post;
  // }

  // Add other models as needed
  // get product(): ExtendedDelegate<Product, Prisma.ProductDelegate> {
  //   return this.extendedClient.product;
  // }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async runInTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return this.$transaction(async tx => fn(tx));
  }
}
