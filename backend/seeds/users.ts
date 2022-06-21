import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    { name: "Rob Hope", pic: "https://randomuser.me/api/portraits/men/37.jpg" },
    {
      name: "Sophie Brecht",
      pic: "https://randomuser.me/api/portraits/women/31.jpg",
    },
    { name: "James", pic: "https://randomuser.me/api/portraits/men/22.jpg" },
    {
      name: "Cameron Lawrence",
      pic: "https://randomuser.me/api/portraits/women/33.jpg",
    },
  ]);
}
