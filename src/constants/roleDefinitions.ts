export const roleDefinitions = {
  super_admin: [{ action: "*", modules: "*" }],

  student_admin: [
    {
      action: ["list", "view", "block_unblock", "admin_approval", "delete"],
      modules: "student",
    },
    { action: ["list", "view", "admin_approval", "delete"], modules: "event" },
    { action: ["list", "update_status", "delete"], modules: "report" },
    { action: ["list", "admin_approval", "delete"], modules: "event-image" },
    { action: ["list", "admin_approval", "delete"], modules: "review" },
    { action: ["list", "admin_approval", "delete"], modules: "volunteer" },
  ],

  npo_admin: [
    {
      action: [
        "list",
        "view",
        "edit",
        "block_unblock",
        "admin_approval",
        "delete",
      ],
      modules: "npo",
    },
    { action: ["list", "view", "admin_approval", "delete"], modules: "event" },
    { action: ["list", "update_status", "delete"], modules: "report" },
    { action: ["list", "admin_approval", "delete"], modules: "event-image" },
    { action: ["list", "admin_approval", "delete"], modules: "review" },
  ],
};
