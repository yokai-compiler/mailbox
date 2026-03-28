import { column, defineDb, defineTable } from "astro:db";

const Email = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    to: column.text({ optional: false }),
    from: column.text({ optional: false }),
    html: column.boolean({ optional: false }),
    text: column.boolean({ optional: false }),
    read: column.boolean({ optional: false }),
    timestamp: column.text({ optional: false }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { Email },
});
