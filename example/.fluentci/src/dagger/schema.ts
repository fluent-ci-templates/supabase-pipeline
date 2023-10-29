import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
} from "../../deps.ts";

import { deploy } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("deploy", {
      args: {
        src: nonNull(stringArg()),
        token: nonNull(stringArg()),
        projectId: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await deploy(args.src, args.token, args.projectId),
    });
  },
});

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});
