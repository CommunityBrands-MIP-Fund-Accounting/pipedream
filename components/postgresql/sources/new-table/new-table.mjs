import common from "../common.mjs";

export default {
  ...common,
  name: "New Table",
  key: "postgresql-new-table",
  description: "Emit new event when a new table is added to the database. [See Docs](https://node-postgres.com/features/queries)",
  version: "1.0.0",
  type: "source",
  props: {
    ...common.props,
    schema: {
      propDefinition: [
        common.props.postgresql,
        "schema",
      ],
    },
  },
  async run() {
    const previousTables = this._getPreviousValues() || [];

    const tables = await this.postgresql.getTables(this.schema);

    const newTables = tables.filter((table) => !previousTables.includes(table));
    for (const table of newTables) {
      const meta = this.generateMeta(table);
      this.$emit(table, meta);
    }

    this._setPreviousValues(tables);
  },
};
