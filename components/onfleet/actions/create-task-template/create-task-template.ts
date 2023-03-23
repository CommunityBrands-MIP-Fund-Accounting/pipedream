import onfleet from "../../app/onfleet.app";
import {
  clearObj, prepareData
} from "../common/utils";

export default {
  key: "onfleet-create-task-template",
  name: "Create Task (Template Use)",
  description: "Creates a single task. Used for simple templates only. [See the docs here](https://docs.onfleet.com/reference/create-task)",
  type: "action",
  version: "0.0.1",
  props: {
    onfleet,
    merchant: {
      propDefinition: [
        onfleet,
        "merchant",
      ],
    },
    executor: {
      propDefinition: [
        onfleet,
        "merchant",
      ],
      label: "Executor",
      description: "The ID of the organization that will be responsible for fulfilling the task. Defaults to the creating organization. If you delegate your deliveries to a third party, provide their organization ID.",
    },
    recipientName: {
      propDefinition: [
        onfleet,
        "recipientName",
      ],
    },
    recipientPhone: {
      propDefinition: [
        onfleet,
        "recipientPhone",
      ],
    },
    recipientNotes: {
      propDefinition: [
        onfleet,
        "recipientNotes",
      ],
      optional: true,
    },
    latitude: {
      propDefinition: [
        onfleet,
        "latitude",
      ],
      optional: true,
    },
    longitude: {
      propDefinition: [
        onfleet,
        "longitude",
      ],
      optional: true,
    },
    street: {
      propDefinition: [
        onfleet,
        "street",
      ],
    },
    apartment: {
      propDefinition: [
        onfleet,
        "apartment",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        onfleet,
        "city",
      ],
    },
    state: {
      propDefinition: [
        onfleet,
        "state",
      ],
    },
    postalCode: {
      propDefinition: [
        onfleet,
        "postalCode",
      ],
    },
    country: {
      propDefinition: [
        onfleet,
        "country",
      ],
    },
    notes: {
      propDefinition: [
        onfleet,
        "notes",
      ],
      optional: true,
    },
    completeAfter: {
      propDefinition: [
        onfleet,
        "completeAfter",
      ],
      optional: true,
    },
    completeBefore: {
      propDefinition: [
        onfleet,
        "completeBefore",
      ],
      optional: true,
    },
    pickupTask: {
      propDefinition: [
        onfleet,
        "pickupTask",
      ],
      optional: true,
    },
    autoAssign: {
      propDefinition: [
        onfleet,
        "autoAssign",
      ],
      reloadProps: true,
    },
    quantity: {
      propDefinition: [
        onfleet,
        "quantity",
      ],
      optional: true,
    },
    serviceTime: {
      propDefinition: [
        onfleet,
        "serviceTime",
      ],
      optional: true,
    },
    signatureRequirement: {
      propDefinition: [
        onfleet,
        "signatureRequirement",
      ],
    },
    photoRequirement: {
      propDefinition: [
        onfleet,
        "photoRequirement",
      ],
    },
    notesRequirement: {
      propDefinition: [
        onfleet,
        "notesRequirement",
      ],
    },
    minimumAgeRequirement: {
      propDefinition: [
        onfleet,
        "minimumAgeRequirement",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    let props = {};
    if (this.autoAssign) {
      if (this.autoAssign != "auto-assign") {
        props = {
          ...props,
          team: {
            type: "string",
            label: "Team Id",
            description: "The team's Id",
            options: async () =>  {
              const teams = await this.onfleet.listTeams();

              return teams.map(({
                id: value,
                name: label,
              }) => ({
                label,
                value,
              }));
            },
          },
        };
      }

      if (this.autoAssign === "driver") {
        props = {
          ...props,
          worker: {
            type: "string",
            label: "Driver",
            description: "The driver's Id",
            options: async () =>  {
              const drivers = await this.onfleet.listWorkers({
                teamId: this.team,
              });

              return drivers.map(({
                id: value,
                name: label,
              }) => ({
                label,
                value,
              }));
            },
          },
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      onfleet,
      ...data
    } = this;

    const preparedData = prepareData(data);
    const response = await onfleet.createTask(clearObj(preparedData));

    $.export("$summary", `A new task with id ${response.id} was successfully created!`);
    return response;
  },
};
