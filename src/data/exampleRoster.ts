/**
 * Example BattleScribe Age of Sigmar roster JSON used by the 'Load Example'
 * button. A full 2000pt Ironjawz list (exported from New Recruit) with a
 * Wizard + spell lore, a Priest + prayer lore, manifestations, and terrain —
 * so the example exercises every tracker feature.
 */
export const exampleRoster =
{
  "roster": {
    "costs": [
      {
        "name": "pts",
        "typeId": "points",
        "value": 1980
      }
    ],
    "costLimits": [
      {
        "name": "pts",
        "typeId": "points",
        "value": 2000
      }
    ],
    "forces": [
      {
        "selections": [
          {
            "profiles": [
              {
                "characteristics": [
                  {
                    "$text": "Once Per Turn (Army), Your Charge Phase",
                    "name": "Timing",
                    "typeId": "652c-3d84-4e7-14f4"
                  },
                  {
                    "$text": "Pick a friendly **^^Ironjawz Hero^^** to be the target. You cannot pick the same **^^Hero^^** to be the target of this ability more than once per battle.",
                    "name": "Declare",
                    "typeId": "bad3-f9c5-ba46-18cb"
                  },
                  {
                    "$text": "For the rest of the turn, the following effects apply to friendly **^^Ironjawz^^** units while they are wholly within 18\" of the target:\n• Add 1 to charge rolls for those units.\n• Add 1 to the Attacks characteristic of those units’ melee weapons.",
                    "name": "Effect",
                    "typeId": "b6f1-ba36-6cd-3b03"
                  },
                  {
                    "$text": "**^^Waaagh!^^**",
                    "name": "Keywords",
                    "typeId": "12e8-3214-7d8f-1d0f"
                  },
                  {
                    "name": "Used By",
                    "typeId": "1b32-c9d6-3106-166b"
                  }
                ],
                "attributes": [
                  {
                    "$text": "Orange",
                    "name": "Color",
                    "typeId": "5a11-eab3-180c-ddf5"
                  },
                  {
                    "$text": "Special",
                    "name": "Type",
                    "typeId": "6d16-c86b-2698-85a4"
                  },
                  {
                    "name": "Parent Node",
                    "typeId": "2d74-4dcd-8468-87fa"
                  }
                ],
                "id": "618e-f241-f5d4-a04b",
                "name": "Ironjawz Waaagh!",
                "hidden": false,
                "typeId": "59b6-d47a-a68a-5dcc",
                "typeName": "Ability (Activated)",
                "from": "entry"
              },
              {
                "characteristics": [
                  {
                    "$text": "Once Per Turn (Army), Any Hero Phase",
                    "name": "Timing",
                    "typeId": "652c-3d84-4e7-14f4"
                  },
                  {
                    "$text": "Pick a friendly **^^Ironjawz^^** unit that was not set up this turn to be the target.",
                    "name": "Declare",
                    "typeId": "bad3-f9c5-ba46-18cb"
                  },
                  {
                    "$text": "The target can move up to 3\". It can move into combat. If it was in combat at the start of the move, it must end that move in combat.",
                    "name": "Effect",
                    "typeId": "b6f1-ba36-6cd-3b03"
                  },
                  {
                    "name": "Keywords",
                    "typeId": "12e8-3214-7d8f-1d0f"
                  },
                  {
                    "name": "Used By",
                    "typeId": "1b32-c9d6-3106-166b"
                  }
                ],
                "attributes": [
                  {
                    "$text": "Yellow",
                    "name": "Color",
                    "typeId": "5a11-eab3-180c-ddf5"
                  },
                  {
                    "$text": "Movement",
                    "name": "Type",
                    "typeId": "6d16-c86b-2698-85a4"
                  },
                  {
                    "name": "Parent Node",
                    "typeId": "2d74-4dcd-8468-87fa"
                  }
                ],
                "id": "a85a-85d4-514a-44a3",
                "name": "Mighty Destroyers",
                "hidden": false,
                "typeId": "59b6-d47a-a68a-5dcc",
                "typeName": "Ability (Activated)",
                "from": "entry"
              }
            ],
            "categories": [
              {
                "id": "3360-1158-e879-9606",
                "entryId": "3360-1158-e879-9606",
                "name": "Reference",
                "primary": true
              }
            ],
            "id": "960yv6",
            "name": "Battle Traits: Ironjawz",
            "entryId": "827-e827-4f40-c1ce::d8ca-c367-a211-97b3",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "selections": [
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "Friendly **^^Ironjawz Infantry^^** units have **^^Ward (6+)^^** while they are wholly within 12\" of any friendly **^^Ironjawz Wizards^^** or **^^Priests^^**.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Green",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "ceee-4e37-3ed9-db91",
                    "name": "Spirit of Gork",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "id": "i0oocf8",
                "name": "Weirdfist",
                "entryId": "a9f8-aa4d-9eed-316a::c2f8-2ea8-7d8b-5670",
                "entryGroupId": "a9f8-aa4d-9eed-316a::a329-a5f1-b106-7917",
                "number": 1,
                "type": "upgrade",
                "from": "group",
                "group": "Battle Formations: Ironjawz"
              }
            ],
            "categories": [
              {
                "id": "ac97-b27c-7e35-7ab9",
                "entryId": "ac97-b27c-7e35-7ab9",
                "name": "Army Composition",
                "primary": true
              }
            ],
            "id": "t733n2e",
            "name": "Battle Formation",
            "entryId": "1218-968b-bd6e-351e",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "selections": [
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "At the start of the battle, pick each friendly non-**^^Hero Infantry^^** and non-**^^Hero Cavalry^^** unit that was not set up in reserve with a **^^Deploy^^** ability to become a scout unit. You cannot complete these battle tactics with scout units that are in combat. Replacement units that replace scout units are also scout units.",
                        "name": "Card",
                        "typeId": "67f1-ce6d-1cf4-a4df"
                      },
                      {
                        "$text": "Raiding Party:\nYou complete this battle tactic at the end of your turn if there are 3 or more friendly scout units wholly outside friendly territory.",
                        "name": "Affray",
                        "typeId": "1047-3e43-674d-dc6c"
                      },
                      {
                        "$text": "Bold Explorers:\nYou complete this battle tactic at the end of your turn if 3 or more objectives or non-**^^Faction Terrain^^** terrain features that you control, in any combination, are being contested by any friendly scout units. Those objectives and terrain features must be within enemy territory.",
                        "name": "Strike",
                        "typeId": "94d4-173e-0f65-c569"
                      },
                      {
                        "$text": "Courageous Adventurers:\nYou complete this battle tactic at the end of your turn if a friendly scout unit that was not set up this turn is contesting a non-**^^Faction Terrain^^** terrain feature that you control that is wholly within enemy territory and more than 6\" from friendly territory.",
                        "name": "Domination",
                        "typeId": "e1d7-1d3c-f001-62e0"
                      }
                    ],
                    "id": "5fc5-3a71-00e9-29f6",
                    "name": "Scouting Force",
                    "hidden": false,
                    "typeId": "abf8-a239-9e66-54c1",
                    "typeName": "Battle Tactic Card",
                    "from": "entry"
                  }
                ],
                "id": "x3dh5pk",
                "name": "Scouting Force",
                "entryId": "2adf-8d5d-6fd6-9bb4",
                "entryGroupId": "e3d8-8106-a496-2ece",
                "number": 1,
                "type": "upgrade",
                "from": "group",
                "group": "Battle Tactic Cards"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "name": "Card",
                        "typeId": "67f1-ce6d-1cf4-a4df"
                      },
                      {
                        "$text": "Sacred Centrality:\nYou complete this battle tactic at the end of your turn if there are at least 2 friendly units within 3\" of the centre of the battlefield that are not in combat.",
                        "name": "Affray",
                        "typeId": "1047-3e43-674d-dc6c"
                      },
                      {
                        "$text": "Fey Strikes:\nYou complete this battle tactic at the end of your turn if all of the following are true:\n• At least 2 friendly units moved as part of a **^^Retreat^^** ability this turn. Those units are the lure units.\n• At least 2 other friendly units used a **^^Charge^^** ability this turn and at least 1 of those units ended the charge move in combat with an enemy unit from which any of the lure units retreated.",
                        "name": "Strike",
                        "typeId": "94d4-173e-0f65-c569"
                      },
                      {
                        "$text": "Purification Rites:\nYou complete this battle tactic at the end of your turn if there are no enemy units within friendly territory and no enemy units within neutral territory.",
                        "name": "Domination",
                        "typeId": "e1d7-1d3c-f001-62e0"
                      }
                    ],
                    "id": "85c3-aaa3-373c-c2ad",
                    "name": "Attuned to Ghyran",
                    "hidden": false,
                    "typeId": "abf8-a239-9e66-54c1",
                    "typeName": "Battle Tactic Card",
                    "from": "entry"
                  }
                ],
                "id": "x34sxpq",
                "name": "Attuned to Ghyran",
                "entryId": "71aa-cea6-7469-01dd",
                "entryGroupId": "e3d8-8106-a496-2ece",
                "number": 1,
                "type": "upgrade",
                "from": "group",
                "group": "Battle Tactic Cards"
              }
            ],
            "categories": [
              {
                "id": "ac97-b27c-7e35-7ab9",
                "entryId": "ac97-b27c-7e35-7ab9",
                "name": "Army Composition",
                "primary": true
              }
            ],
            "id": "taesl8",
            "name": "Battle Tactic Cards",
            "entryId": "1668-6989-2470-5e10",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "selections": [
              {
                "selections": [
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "-",
                            "name": "Move",
                            "typeId": "c28a-6000-2a0b-e7cf"
                          },
                          {
                            "$text": "8",
                            "name": "Health",
                            "typeId": "d1b9-3068-515-131e"
                          },
                          {
                            "$text": "4+",
                            "name": "Save",
                            "typeId": "80c7-7691-b6ed-d6a6"
                          },
                          {
                            "$text": "7+",
                            "name": "Banishment",
                            "typeId": "97a2-d412-9ac-6a37"
                          }
                        ],
                        "attributes": [
                          {
                            "name": "Base Size",
                            "typeId": "50db-066e-a3e7-696f"
                          }
                        ],
                        "id": "0053-e352-4095-1187",
                        "name": "Foot of Gork",
                        "hidden": false,
                        "typeId": "1287-3a-9799-7e40",
                        "typeName": "Manifestation",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "$text": "Once Per Turn, Your Movement Phase",
                            "name": "Timing",
                            "typeId": "652c-3d84-4e7-14f4"
                          },
                          {
                            "$text": "Pick a part of this **^^Manifestation^^** to be the target.",
                            "name": "Declare",
                            "typeId": "bad3-f9c5-ba46-18cb"
                          },
                          {
                            "$text": "Remove the target from the battlefield and set it up again on the battlefield wholly within 9\" of the other part of this **^^Manifestation^^**.\n Then, roll a D3 for each enemy unit within 3\" of the target. On a 2+:\n• Inflict an amount of mortal damage on the target equal to the roll.\n• That unit has the **^^Stomped^^** keyword until the start of your next turn.\n• Subtract 1 from the number of dice rolled when making charge rolls for **^^Stomped^^** units, to a minimum of 1.",
                            "name": "Effect",
                            "typeId": "b6f1-ba36-6cd-3b03"
                          },
                          {
                            "name": "Keywords",
                            "typeId": "12e8-3214-7d8f-1d0f"
                          },
                          {
                            "name": "Used By",
                            "typeId": "1b32-c9d6-3106-166b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Gray",
                            "name": "Color",
                            "typeId": "5a11-eab3-180c-ddf5"
                          },
                          {
                            "$text": "Special",
                            "name": "Type",
                            "typeId": "6d16-c86b-2698-85a4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "2d74-4dcd-8468-87fa"
                          }
                        ],
                        "id": "c283-48bf-19e6-0911",
                        "name": "Wandering Destruction",
                        "hidden": false,
                        "typeId": "59b6-d47a-a68a-5dcc",
                        "typeName": "Ability (Activated)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "name": "Keywords",
                            "typeId": "b977-7c5e-33b2-428e"
                          },
                          {
                            "$text": "When a number of damage points equal to this **^^Manifestation^^**'s Health characteristic are allocated to it, this **^^Manifestation^^** is destroyed and all its parts are removed from play.",
                            "name": "Effect",
                            "typeId": "fd7f-888d-3257-a12b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Black",
                            "name": "Color",
                            "typeId": "50fe-4f29-6bc3-dcc6"
                          },
                          {
                            "$text": "Special",
                            "name": "Type",
                            "typeId": "bf11-4e10-3ab1-06f4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "e2e1-15ca-d345-22b8"
                          }
                        ],
                        "id": "e24e-51c6-ebf9-ede1",
                        "name": "Multiple Parts",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "name": "Keywords",
                            "typeId": "b977-7c5e-33b2-428e"
                          },
                          {
                            "$text": "In step 1 of the damage sequence (see 18.0), make a **ward roll** of D6 for each **damage point** in this unit’s **damage pool**. If the roll equals or exceeds this unit’s **ward value**, remove that damage point from the damage pool.",
                            "name": "Effect",
                            "typeId": "fd7f-888d-3257-a12b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Black",
                            "name": "Color",
                            "typeId": "50fe-4f29-6bc3-dcc6"
                          },
                          {
                            "$text": "Defensive",
                            "name": "Type",
                            "typeId": "bf11-4e10-3ab1-06f4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "e2e1-15ca-d345-22b8"
                          }
                        ],
                        "id": "ed70-f30-2f5a-747f",
                        "name": "Ward Save",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      }
                    ],
                    "categories": [
                      {
                        "id": "70a4-383f-421f-52cd",
                        "name": "WARD (6+)",
                        "entryId": "70a4-383f-421f-52cd",
                        "primary": false
                      },
                      {
                        "id": "bff0-8be9-719f-4afc",
                        "name": "MANIFESTATION",
                        "entryId": "bff0-8be9-719f-4afc",
                        "primary": false
                      },
                      {
                        "id": "e7bc-543-4076-553c",
                        "name": "ENDLESS SPELL",
                        "entryId": "e7bc-543-4076-553c",
                        "primary": false
                      },
                      {
                        "id": "c1ca-4b17-3512-89f",
                        "name": "IRONJAWZ",
                        "entryId": "c1ca-4b17-3512-89f",
                        "primary": false
                      },
                      {
                        "id": "6e42-3c75-4cb5-337a",
                        "name": "KRULEBOYZ",
                        "entryId": "6e42-3c75-4cb5-337a",
                        "primary": false
                      },
                      {
                        "id": "9057-5a29-dda5-3c28",
                        "name": "DESTRUCTION",
                        "entryId": "9057-5a29-dda5-3c28",
                        "primary": false
                      }
                    ],
                    "id": "fnyr3cl",
                    "name": "Foot of Gork",
                    "entryId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::4da2-4264-87eb-cbcc::6cc6-3227-bf8d-1a1d",
                    "entryGroupId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::47c8-0896-5933-1d11",
                    "number": 1,
                    "type": "unit",
                    "from": "group",
                    "group": "Manifestations of Gorkamorka"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "6\"",
                            "name": "Move",
                            "typeId": "c28a-6000-2a0b-e7cf"
                          },
                          {
                            "$text": "6",
                            "name": "Health",
                            "typeId": "d1b9-3068-515-131e"
                          },
                          {
                            "$text": "5+",
                            "name": "Save",
                            "typeId": "80c7-7691-b6ed-d6a6"
                          },
                          {
                            "$text": "7+",
                            "name": "Banishment",
                            "typeId": "97a2-d412-9ac-6a37"
                          }
                        ],
                        "attributes": [
                          {
                            "name": "Base Size",
                            "typeId": "50db-066e-a3e7-696f"
                          }
                        ],
                        "id": "eb52-b5e4-14b1-d5cc",
                        "name": "Gork-Roara",
                        "hidden": false,
                        "typeId": "1287-3a-9799-7e40",
                        "typeName": "Manifestation",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "652c-3d84-4e7-14f4"
                          },
                          {
                            "$text": "Pick a friendly **^^Ironjawz^^** or **^^Kruleboyz Wizard^^** or **^^Priest^^** within 3\" of this **^^Manifestation^^**  to be the target.",
                            "name": "Declare",
                            "typeId": "bad3-f9c5-ba46-18cb"
                          },
                          {
                            "$text": "Pick either 1 or 2 to add to casting rolls or chanting rolls for the target until the start of your next turn. Then, roll a number of dice equal to the number picked. For each 1-2, allocate 1 damage point to the target (ward rolls cannot be made for those damage points). For each 5+, until the start of your next turn, add 1 to charge rolls for friendly **^^Kruleboyz^^** or **^^Ironjawz^^** units while they are wholly within 12\" of this **^^Manifestation^^**. Friendly units can be affected by this ability multiple times and the effects are cumulative.",
                            "name": "Effect",
                            "typeId": "b6f1-ba36-6cd-3b03"
                          },
                          {
                            "name": "Keywords",
                            "typeId": "12e8-3214-7d8f-1d0f"
                          },
                          {
                            "name": "Used By",
                            "typeId": "1b32-c9d6-3106-166b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "5a11-eab3-180c-ddf5"
                          },
                          {
                            "$text": "Special",
                            "name": "Type",
                            "typeId": "6d16-c86b-2698-85a4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "2d74-4dcd-8468-87fa"
                          }
                        ],
                        "id": "501b-f7fc-4c78-df55",
                        "name": "Bellowing Waaagh!-Cries",
                        "hidden": false,
                        "typeId": "59b6-d47a-a68a-5dcc",
                        "typeName": "Ability (Activated)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "$text": "5",
                            "name": "Atk",
                            "typeId": "60e-35aa-31ed-e488"
                          },
                          {
                            "$text": "2+",
                            "name": "Hit",
                            "typeId": "26dc-168-b2fd-cb93"
                          },
                          {
                            "$text": "4+",
                            "name": "Wnd",
                            "typeId": "61c1-22cc-40af-2847"
                          },
                          {
                            "$text": "1",
                            "name": "Rnd",
                            "typeId": "eccc-10fa-6958-fb73"
                          },
                          {
                            "$text": "D3",
                            "name": "Dmg",
                            "typeId": "e948-9c71-12a6-6be4"
                          },
                          {
                            "$text": "-",
                            "name": "Ability",
                            "typeId": "eda3-7332-5db1-4159"
                          }
                        ],
                        "id": "de29-db86-9ccb-a459",
                        "name": "Toxic Gas",
                        "hidden": false,
                        "typeId": "9074-76b6-9e2f-81e3",
                        "typeName": "Melee Weapon",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "name": "Keywords",
                            "typeId": "b977-7c5e-33b2-428e"
                          },
                          {
                            "$text": "In step 1 of the damage sequence (see 18.0), make a **ward roll** of D6 for each **damage point** in this unit’s **damage pool**. If the roll equals or exceeds this unit’s **ward value**, remove that damage point from the damage pool.",
                            "name": "Effect",
                            "typeId": "fd7f-888d-3257-a12b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Black",
                            "name": "Color",
                            "typeId": "50fe-4f29-6bc3-dcc6"
                          },
                          {
                            "$text": "Defensive",
                            "name": "Type",
                            "typeId": "bf11-4e10-3ab1-06f4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "e2e1-15ca-d345-22b8"
                          }
                        ],
                        "id": "ed70-f30-2f5a-747f",
                        "name": "Ward Save",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      }
                    ],
                    "categories": [
                      {
                        "id": "70a4-383f-421f-52cd",
                        "name": "WARD (6+)",
                        "entryId": "70a4-383f-421f-52cd",
                        "primary": false
                      },
                      {
                        "id": "bff0-8be9-719f-4afc",
                        "name": "MANIFESTATION",
                        "entryId": "bff0-8be9-719f-4afc",
                        "primary": false
                      },
                      {
                        "id": "e7bc-543-4076-553c",
                        "name": "ENDLESS SPELL",
                        "entryId": "e7bc-543-4076-553c",
                        "primary": false
                      },
                      {
                        "id": "c1ca-4b17-3512-89f",
                        "name": "IRONJAWZ",
                        "entryId": "c1ca-4b17-3512-89f",
                        "primary": false
                      },
                      {
                        "id": "6e42-3c75-4cb5-337a",
                        "name": "KRULEBOYZ",
                        "entryId": "6e42-3c75-4cb5-337a",
                        "primary": false
                      }
                    ],
                    "id": "fouc6b",
                    "name": "Gork-Roara",
                    "entryId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::4aac-c0ea-c0d1-1e02::4362-f538-078e-fb12",
                    "entryGroupId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::47c8-0896-5933-1d11",
                    "number": 1,
                    "type": "unit",
                    "from": "group",
                    "group": "Manifestations of Gorkamorka"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "-",
                            "name": "Move",
                            "typeId": "c28a-6000-2a0b-e7cf"
                          },
                          {
                            "$text": "8",
                            "name": "Health",
                            "typeId": "d1b9-3068-515-131e"
                          },
                          {
                            "$text": "5+",
                            "name": "Save",
                            "typeId": "80c7-7691-b6ed-d6a6"
                          },
                          {
                            "$text": "7+",
                            "name": "Banishment",
                            "typeId": "97a2-d412-9ac-6a37"
                          }
                        ],
                        "attributes": [
                          {
                            "name": "Base Size",
                            "typeId": "50db-066e-a3e7-696f"
                          }
                        ],
                        "id": "ebad-00fa-c0e7-7c65",
                        "name": "Morkspit Marsh",
                        "hidden": false,
                        "typeId": "1287-3a-9799-7e40",
                        "typeName": "Manifestation",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "name": "Keywords",
                            "typeId": "b977-7c5e-33b2-428e"
                          },
                          {
                            "$text": "Subtract 3 from the control score of enemy units while they are within 6\" of this **^^Manifestation^^**.",
                            "name": "Effect",
                            "typeId": "fd7f-888d-3257-a12b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "50fe-4f29-6bc3-dcc6"
                          },
                          {
                            "$text": "Special",
                            "name": "Type",
                            "typeId": "bf11-4e10-3ab1-06f4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "e2e1-15ca-d345-22b8"
                          }
                        ],
                        "id": "46e3-fca7-bc5c-a2ef",
                        "name": "Tricksy Footing",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "name": "Keywords",
                            "typeId": "b977-7c5e-33b2-428e"
                          },
                          {
                            "$text": "Enemy units cannot use **^^Run^^** abilities while they are within 6\" of this **^^Manifestation^^**.",
                            "name": "Effect",
                            "typeId": "fd7f-888d-3257-a12b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Gray",
                            "name": "Color",
                            "typeId": "50fe-4f29-6bc3-dcc6"
                          },
                          {
                            "$text": "Movement",
                            "name": "Type",
                            "typeId": "bf11-4e10-3ab1-06f4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "e2e1-15ca-d345-22b8"
                          }
                        ],
                        "id": "e55b-cfd0-5ddf-3ef4",
                        "name": "Grasping Gunge",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "name": "Keywords",
                            "typeId": "b977-7c5e-33b2-428e"
                          },
                          {
                            "$text": "In step 1 of the damage sequence (see 18.0), make a **ward roll** of D6 for each **damage point** in this unit’s **damage pool**. If the roll equals or exceeds this unit’s **ward value**, remove that damage point from the damage pool.",
                            "name": "Effect",
                            "typeId": "fd7f-888d-3257-a12b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Black",
                            "name": "Color",
                            "typeId": "50fe-4f29-6bc3-dcc6"
                          },
                          {
                            "$text": "Defensive",
                            "name": "Type",
                            "typeId": "bf11-4e10-3ab1-06f4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "e2e1-15ca-d345-22b8"
                          }
                        ],
                        "id": "ed70-f30-2f5a-747f",
                        "name": "Ward Save",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      }
                    ],
                    "categories": [
                      {
                        "id": "70a4-383f-421f-52cd",
                        "name": "WARD (6+)",
                        "entryId": "70a4-383f-421f-52cd",
                        "primary": false
                      },
                      {
                        "id": "bff0-8be9-719f-4afc",
                        "name": "MANIFESTATION",
                        "entryId": "bff0-8be9-719f-4afc",
                        "primary": false
                      },
                      {
                        "id": "e7bc-543-4076-553c",
                        "name": "ENDLESS SPELL",
                        "entryId": "e7bc-543-4076-553c",
                        "primary": false
                      },
                      {
                        "id": "c1ca-4b17-3512-89f",
                        "name": "IRONJAWZ",
                        "entryId": "c1ca-4b17-3512-89f",
                        "primary": false
                      },
                      {
                        "id": "6e42-3c75-4cb5-337a",
                        "name": "KRULEBOYZ",
                        "entryId": "6e42-3c75-4cb5-337a",
                        "primary": false
                      },
                      {
                        "id": "9057-5a29-dda5-3c28",
                        "name": "DESTRUCTION",
                        "entryId": "9057-5a29-dda5-3c28",
                        "primary": false
                      }
                    ],
                    "id": "fogqsz",
                    "name": "Morkspit Marsh",
                    "entryId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::4ce6-7507-652a-90fc::9500-6054-f472-f184",
                    "entryGroupId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::47c8-0896-5933-1d11",
                    "number": 1,
                    "type": "unit",
                    "from": "group",
                    "group": "Manifestations of Gorkamorka"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "de6f-d57b-248a-83be"
                          },
                          {
                            "$text": "7",
                            "name": "Casting Value",
                            "typeId": "9fc7-b0f6-d018-a608"
                          },
                          {
                            "$text": "If there is not a friendly **Foot of Gork** on the battlefield, pick a friendly **^^Ironjawz Wizard^^** to cast this spell, then make a casting roll of 2D6.",
                            "name": "Declare",
                            "typeId": "24f8-3803-4ab1-3b6c"
                          },
                          {
                            "$text": "Set up a **Foot of Gork** wholly within 12\" of the caster, visible to them and more than 9\" from all enemy units. A **Foot of Gork** has 2 parts that must be set up within 9\" of each other.",
                            "name": "Effect",
                            "typeId": "1cb9-a-1345-907f"
                          },
                          {
                            "$text": "**^^Spell^^**, **^^Summon^^**",
                            "name": "Keywords",
                            "typeId": "353f-565e-c351-1cf2"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "16b6-0911-f549-a4bd"
                          },
                          {
                            "$text": "Special",
                            "name": "Parent Node",
                            "typeId": "da27-8d61-f955-5031"
                          }
                        ],
                        "id": "bc27-b93a-7330-3b40",
                        "name": "Summon Foot of Gork",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      }
                    ],
                    "id": "fnxu5eg",
                    "name": "Summon Foot of Gork",
                    "entryId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::de4b-d9e8-9f81-0aca",
                    "entryGroupId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::47c8-0896-5933-1d11",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Manifestations of Gorkamorka"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "de6f-d57b-248a-83be"
                          },
                          {
                            "$text": "5",
                            "name": "Casting Value",
                            "typeId": "9fc7-b0f6-d018-a608"
                          },
                          {
                            "$text": "If there is not a friendly **Gork-Roara** on the battlefield, pick a friendly **^^Ironjawz Wizard^^** to cast this spell, then make a casting roll of 2D6.",
                            "name": "Declare",
                            "typeId": "24f8-3803-4ab1-3b6c"
                          },
                          {
                            "$text": "Set up a **Gork-Roara** wholly within 12\" of the caster, visible to them and more than 9\" from all enemy units.",
                            "name": "Effect",
                            "typeId": "1cb9-a-1345-907f"
                          },
                          {
                            "$text": "**^^Spell^^**, **^^Summon^^**",
                            "name": "Keywords",
                            "typeId": "353f-565e-c351-1cf2"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "16b6-0911-f549-a4bd"
                          },
                          {
                            "$text": "Special",
                            "name": "Parent Node",
                            "typeId": "da27-8d61-f955-5031"
                          }
                        ],
                        "id": "5404-e3c5-139c-3288",
                        "name": "Summon Gork-Roara",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      }
                    ],
                    "id": "fntalwy",
                    "name": "Summon Gork-Roara",
                    "entryId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::3bf9-4cf1-df1e-8e55",
                    "entryGroupId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::47c8-0896-5933-1d11",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Manifestations of Gorkamorka"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "de6f-d57b-248a-83be"
                          },
                          {
                            "$text": "5",
                            "name": "Casting Value",
                            "typeId": "9fc7-b0f6-d018-a608"
                          },
                          {
                            "$text": "If there is not a friendly **Morkspit Marsh** on the battlefield, pick a friendly **^^Ironjawz Wizard^^** to cast this spell, then make a casting roll of 2D6.",
                            "name": "Declare",
                            "typeId": "24f8-3803-4ab1-3b6c"
                          },
                          {
                            "$text": "Set up a **Morkspit Marsh** wholly within 18\" of the caster and visible to them.",
                            "name": "Effect",
                            "typeId": "1cb9-a-1345-907f"
                          },
                          {
                            "$text": "**^^Spell^^**, **^^Summon^^**",
                            "name": "Keywords",
                            "typeId": "353f-565e-c351-1cf2"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "16b6-0911-f549-a4bd"
                          },
                          {
                            "$text": "Special",
                            "name": "Parent Node",
                            "typeId": "da27-8d61-f955-5031"
                          }
                        ],
                        "id": "e7c6-5130-337a-e53a",
                        "name": "Summon Morkspit Marsh",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      }
                    ],
                    "id": "fmhrrva",
                    "name": "Summon Morkspit Marsh",
                    "entryId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::ac23-a0f8-b850-8364",
                    "entryGroupId": "f9a1-ded2-73fb-3338::a8be-92a8-fabe-9556::47c8-0896-5933-1d11",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Manifestations of Gorkamorka"
                  }
                ],
                "id": "x5r1lxk",
                "name": "Manifestations of Gorkamorka",
                "entryId": "f9a1-ded2-73fb-3338::2fad-f066-fa21-42f6",
                "entryGroupId": "f9a1-ded2-73fb-3338::288e-a28e-a60c-1c9e",
                "number": 1,
                "type": "upgrade",
                "from": "group",
                "group": "Manifestation Lores"
              }
            ],
            "categories": [
              {
                "id": "ac97-b27c-7e35-7ab9",
                "entryId": "ac97-b27c-7e35-7ab9",
                "name": "Army Composition",
                "primary": true
              }
            ],
            "id": "tcr6dwk",
            "name": "Manifestation Lore",
            "entryId": "94cc-9a4c-e4a2-6da1",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "selections": [
              {
                "selections": [
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "76bf-8126-64d4-c709"
                          },
                          {
                            "$text": "4",
                            "name": "Chanting Value",
                            "typeId": "f192-6780-8138-9cef"
                          },
                          {
                            "$text": "Pick a friendly **^^Ironjawz Priest^^** to chant this prayer, pick a visible friendly **^^Ironjawz^^** unit wholly within 12\" of them to be the target, then make a chanting roll of D6.",
                            "name": "Declare",
                            "typeId": "284c-90b2-245b-adf3"
                          },
                          {
                            "$text": "**Heal (D6)** the target. If the chanting roll was 8+, **Heal (D3+3)** the target instead.",
                            "name": "Effect",
                            "typeId": "6219-6fcc-5ae2-a6b7"
                          },
                          {
                            "$text": "**^^Prayer^^**",
                            "name": "Keywords",
                            "typeId": "e3d8-f58b-e4e0-8e9d"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "7564-4bf0-b34a-b143"
                          },
                          {
                            "$text": "Defensive",
                            "name": "Type",
                            "typeId": "c63c-196d-34a7-cec3"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "5d25-63d6-3935-9312"
                          }
                        ],
                        "id": "5606-7489-d49f-e84",
                        "name": "Fixin' Beat",
                        "hidden": false,
                        "typeId": "5946-234-d7b4-6195",
                        "typeName": "Ability (Prayer)",
                        "from": "entry"
                      }
                    ],
                    "id": "tg2ktu",
                    "name": "Fixin' Beat",
                    "entryId": "7339-e4f5-ee09-bd87::67e6-2bfb-e5d4-6979::3e3e-a616-5969-6d0b",
                    "entryGroupId": "7339-e4f5-ee09-bd87::67e6-2bfb-e5d4-6979::3188-fb52-1d9a-d3ad",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Warbeats"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "76bf-8126-64d4-c709"
                          },
                          {
                            "$text": "4",
                            "name": "Chanting Value",
                            "typeId": "f192-6780-8138-9cef"
                          },
                          {
                            "$text": "Pick a friendly **^^Ironjawz Priest^^** to chant this prayer, pick a visible friendly **^^Ironjawz^^** unit wholly within 12\" of them to be the target, then make a chanting roll of D6.",
                            "name": "Declare",
                            "typeId": "284c-90b2-245b-adf3"
                          },
                          {
                            "$text": "For the rest of the turn, add 1 to charge rolls for the target. In addition, if the chanting roll was 8+, add 1 to the number of dice rolled when making charge rolls for the target, to a maximum of 3.",
                            "name": "Effect",
                            "typeId": "6219-6fcc-5ae2-a6b7"
                          },
                          {
                            "$text": "**^^Prayer^^**, **^^Unlimited^^**",
                            "name": "Keywords",
                            "typeId": "e3d8-f58b-e4e0-8e9d"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "7564-4bf0-b34a-b143"
                          },
                          {
                            "$text": "Movement",
                            "name": "Type",
                            "typeId": "c63c-196d-34a7-cec3"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "5d25-63d6-3935-9312"
                          }
                        ],
                        "id": "8b84-cf49-aa4c-7814",
                        "name": "Get 'Em Beat",
                        "hidden": false,
                        "typeId": "5946-234-d7b4-6195",
                        "typeName": "Ability (Prayer)",
                        "from": "entry"
                      }
                    ],
                    "id": "tgo2hm",
                    "name": "Get 'Em Beat",
                    "entryId": "7339-e4f5-ee09-bd87::67e6-2bfb-e5d4-6979::2929-c9d5-1e9e-1d3e",
                    "entryGroupId": "7339-e4f5-ee09-bd87::67e6-2bfb-e5d4-6979::3188-fb52-1d9a-d3ad",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Warbeats"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "76bf-8126-64d4-c709"
                          },
                          {
                            "$text": "5",
                            "name": "Chanting Value",
                            "typeId": "f192-6780-8138-9cef"
                          },
                          {
                            "$text": "Pick a friendly **^^Ironjawz Priest^^** to chant this prayer, pick a visible friendly **^^Ironjawz^^** unit wholly within 12\" of them to be the target, then make a chanting roll of D6.",
                            "name": "Declare",
                            "typeId": "284c-90b2-245b-adf3"
                          },
                          {
                            "$text": "Add 1 to the Damage characteristic of the target’s melee weapons until the start of your next turn. If the chanting roll was 10+, you can pick up to 2 eligible units to be the targets instead of 1.",
                            "name": "Effect",
                            "typeId": "6219-6fcc-5ae2-a6b7"
                          },
                          {
                            "$text": "**^^Prayer^^**",
                            "name": "Keywords",
                            "typeId": "e3d8-f58b-e4e0-8e9d"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "7564-4bf0-b34a-b143"
                          },
                          {
                            "$text": "Offensive",
                            "name": "Type",
                            "typeId": "c63c-196d-34a7-cec3"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "5d25-63d6-3935-9312"
                          }
                        ],
                        "id": "55b0-9f01-4604-6322",
                        "name": "Killa Beat",
                        "hidden": false,
                        "typeId": "5946-234-d7b4-6195",
                        "typeName": "Ability (Prayer)",
                        "from": "entry"
                      }
                    ],
                    "id": "tgekk6l",
                    "name": "Killa Beat",
                    "entryId": "7339-e4f5-ee09-bd87::67e6-2bfb-e5d4-6979::88f3-56cc-3ffe-ff27",
                    "entryGroupId": "7339-e4f5-ee09-bd87::67e6-2bfb-e5d4-6979::3188-fb52-1d9a-d3ad",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Warbeats"
                  }
                ],
                "id": "tfdw5s",
                "name": "Warbeats",
                "entryId": "7339-e4f5-ee09-bd87::36aa-af55-d210-d137",
                "entryGroupId": "7339-e4f5-ee09-bd87::a537-457-99e-8b30",
                "number": 1,
                "type": "upgrade",
                "from": "group",
                "group": "Prayer Lores"
              }
            ],
            "categories": [
              {
                "id": "ac97-b27c-7e35-7ab9",
                "entryId": "ac97-b27c-7e35-7ab9",
                "name": "Army Composition",
                "primary": true
              }
            ],
            "id": "tf5noqc",
            "name": "Prayer Lore",
            "entryId": "35fa-60e6-258a-561f",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "selections": [
              {
                "selections": [
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "de6f-d57b-248a-83be"
                          },
                          {
                            "$text": "6",
                            "name": "Casting Value",
                            "typeId": "9fc7-b0f6-d018-a608"
                          },
                          {
                            "$text": "Pick a friendly **^^Ironjawz Wizard^^** to cast this spell, pick a visible friendly **^^Ironjawz^^** unit wholly within 12\" of them to be the target, then make a casting roll of 2D6.",
                            "name": "Declare",
                            "typeId": "24f8-3803-4ab1-3b6c"
                          },
                          {
                            "$text": "The target’s melee weapons have **Crit (2 Hits)** until the start of your next turn",
                            "name": "Effect",
                            "typeId": "1cb9-a-1345-907f"
                          },
                          {
                            "$text": "**^^Spell^^**, **^^Unlimited^^**",
                            "name": "Keywords",
                            "typeId": "353f-565e-c351-1cf2"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "16b6-0911-f549-a4bd"
                          },
                          {
                            "$text": "Offensive",
                            "name": "Parent Node",
                            "typeId": "da27-8d61-f955-5031"
                          }
                        ],
                        "id": "ea0c-5e7-77ba-167d",
                        "name": "Bash 'Em, Ladz",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      }
                    ],
                    "id": "tixv17u",
                    "name": "Bash 'Em, Ladz",
                    "entryId": "6bce-6e0-ed32-6b66::9da0-cf03-a001-662e::108f-8694-8e15-b05e",
                    "entryGroupId": "6bce-6e0-ed32-6b66::9da0-cf03-a001-662e::0713-41e8-e557-2eb6",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Lore of the Weird"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "de6f-d57b-248a-83be"
                          },
                          {
                            "$text": "7",
                            "name": "Casting Value",
                            "typeId": "9fc7-b0f6-d018-a608"
                          },
                          {
                            "$text": "Pick a friendly **^^Ironjawz Wizard^^** to cast this spell, pick a visible friendly unit wholly within 12\" of them and not in combat to be the target, then make a casting roll of 2D6.",
                            "name": "Declare",
                            "typeId": "24f8-3803-4ab1-3b6c"
                          },
                          {
                            "$text": "Remove the target from the battlefield and set it up again wholly within 24\" of the caster and more than 9\" from all enemy units.",
                            "name": "Effect",
                            "typeId": "1cb9-a-1345-907f"
                          },
                          {
                            "$text": "**^^Spell^^**",
                            "name": "Keywords",
                            "typeId": "353f-565e-c351-1cf2"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "16b6-0911-f549-a4bd"
                          },
                          {
                            "$text": "Movement",
                            "name": "Parent Node",
                            "typeId": "da27-8d61-f955-5031"
                          }
                        ],
                        "id": "d612-3e23-847d-c58b",
                        "name": "Da Great Big Green Hand of Gork",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      }
                    ],
                    "id": "tiafwvn",
                    "name": "Da Great Big Green Hand of Gork",
                    "entryId": "6bce-6e0-ed32-6b66::9da0-cf03-a001-662e::0f36-4605-74ec-d7f8",
                    "entryGroupId": "6bce-6e0-ed32-6b66::9da0-cf03-a001-662e::0713-41e8-e557-2eb6",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Lore of the Weird"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "de6f-d57b-248a-83be"
                          },
                          {
                            "$text": "6",
                            "name": "Casting Value",
                            "typeId": "9fc7-b0f6-d018-a608"
                          },
                          {
                            "$text": "Pick a friendly **^^Ironjawz Wizard^^** to cast this spell, pick a visible enemy unit within 18\" of them to be the target, then make a casting roll of 2D6.",
                            "name": "Declare",
                            "typeId": "24f8-3803-4ab1-3b6c"
                          },
                          {
                            "$text": "Inflict D3 mortal damage on the target. If the target is a **^^Wizard^^**, inflict 3 mortal damage on the target instead.",
                            "name": "Effect",
                            "typeId": "1cb9-a-1345-907f"
                          },
                          {
                            "$text": "**^^Spell^^**",
                            "name": "Keywords",
                            "typeId": "353f-565e-c351-1cf2"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "16b6-0911-f549-a4bd"
                          },
                          {
                            "$text": "Offensive",
                            "name": "Parent Node",
                            "typeId": "da27-8d61-f955-5031"
                          }
                        ],
                        "id": "d016-5f8d-9e32-4df0",
                        "name": "Mighty 'Eadbutt",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      }
                    ],
                    "id": "tj0zuz",
                    "name": "Mighty 'Eadbutt",
                    "entryId": "6bce-6e0-ed32-6b66::9da0-cf03-a001-662e::c3fb-0027-f11d-453d",
                    "entryGroupId": "6bce-6e0-ed32-6b66::9da0-cf03-a001-662e::0713-41e8-e557-2eb6",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Lore of the Weird"
                  }
                ],
                "id": "tibcyy",
                "name": "Lore of the Weird",
                "entryId": "6bce-6e0-ed32-6b66::4936-321c-38e9-4dc",
                "entryGroupId": "6bce-6e0-ed32-6b66::b5b-5dbc-9d3b-d075",
                "number": 1,
                "type": "upgrade",
                "from": "group",
                "group": "Spell Lores"
              }
            ],
            "categories": [
              {
                "id": "ac97-b27c-7e35-7ab9",
                "entryId": "ac97-b27c-7e35-7ab9",
                "name": "Army Composition",
                "primary": true
              }
            ],
            "id": "th9kq7p",
            "name": "Spell Lore",
            "entryId": "6876-59db-5e39-aa8a",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "rules": [
              {
                "description": "**The following universal terrain abilities apply to this terrain feature (Terrain, 1.2):\nCover, Impassable**",
                "id": "2fe4-c3be-79bf-ca8f",
                "name": "Bossrokk Tower",
                "hidden": false
              }
            ],
            "profiles": [
              {
                "characteristics": [
                  {
                    "name": "Keywords",
                    "typeId": "b977-7c5e-33b2-428e"
                  },
                  {
                    "$text": "While this terrain feature has a Shouty Boss:\n• The Shouty Boss cannot use **^^Move^^** abilities.\n• Instead of measuring range or visibility to the Shouty Boss, measure to this terrain feature instead.\n• All attacks that would target the Shouty Boss target this terrain feature instead.\n• If this terrain feature is destroyed, before removing it from the battlefield, inflict D3 mortal damage on the Shouty Boss. Then, set up the Shouty Boss on the battlefield within 3\" of this terrain feature and not in combat. That unit is no longer the Shouty Boss. If it is not possible to set up the Shouty Boss, it is slain.",
                    "name": "Effect",
                    "typeId": "fd7f-888d-3257-a12b"
                  }
                ],
                "attributes": [
                  {
                    "$text": "Black",
                    "name": "Color",
                    "typeId": "50fe-4f29-6bc3-dcc6"
                  },
                  {
                    "$text": "Special",
                    "name": "Type",
                    "typeId": "bf11-4e10-3ab1-06f4"
                  },
                  {
                    "name": "Parent Node",
                    "typeId": "e2e1-15ca-d345-22b8"
                  }
                ],
                "id": "f22e-a187-3eba-0a67",
                "name": "Man da Tower!",
                "hidden": false,
                "typeId": "907f-a48-6a04-f788",
                "typeName": "Ability (Passive)",
                "from": "entry"
              },
              {
                "characteristics": [
                  {
                    "$text": "-",
                    "name": "Move",
                    "typeId": "fed0-d1b3-1bb8-c501"
                  },
                  {
                    "$text": "12",
                    "name": "Health",
                    "typeId": "96be-54ae-ce7b-10b7"
                  },
                  {
                    "$text": "4+",
                    "name": "Save",
                    "typeId": "1981-ef09-96f6-7aa9"
                  },
                  {
                    "$text": "-",
                    "name": "Control",
                    "typeId": "6c6f-8510-9ce1-fc6e"
                  }
                ],
                "id": "8c61-11d2-e0f8-2aad",
                "name": "Bossrokk Tower",
                "hidden": false,
                "typeId": "ff03-376e-972f-8ab2",
                "typeName": "Unit",
                "from": "entry"
              },
              {
                "characteristics": [
                  {
                    "$text": "Your Hero Phase",
                    "name": "Timing",
                    "typeId": "652c-3d84-4e7-14f4"
                  },
                  {
                    "$text": "If this terrain feature does not have a Shouty Boss , pick a friendly **^^Ironjawz Infantry Hero^^** that is not in combat and is within 3\" of it  to be the target.",
                    "name": "Declare",
                    "typeId": "bad3-f9c5-ba46-18cb"
                  },
                  {
                    "$text": "Place the target on this terrain feature. The target is now a Shouty Boss (see ‘Man da Tower’).",
                    "name": "Effect",
                    "typeId": "b6f1-ba36-6cd-3b03"
                  },
                  {
                    "name": "Keywords",
                    "typeId": "12e8-3214-7d8f-1d0f"
                  },
                  {
                    "name": "Used By",
                    "typeId": "1b32-c9d6-3106-166b"
                  }
                ],
                "attributes": [
                  {
                    "$text": "Yellow",
                    "name": "Color",
                    "typeId": "5a11-eab3-180c-ddf5"
                  },
                  {
                    "$text": "Movement",
                    "name": "Type",
                    "typeId": "6d16-c86b-2698-85a4"
                  },
                  {
                    "name": "Parent Node",
                    "typeId": "2d74-4dcd-8468-87fa"
                  }
                ],
                "id": "d236-0df7-ff07-1e20",
                "name": "Up We Go!",
                "hidden": false,
                "typeId": "59b6-d47a-a68a-5dcc",
                "typeName": "Ability (Activated)",
                "from": "entry"
              },
              {
                "characteristics": [
                  {
                    "$text": "Once Per Turn, Your Hero Phase",
                    "name": "Timing",
                    "typeId": "652c-3d84-4e7-14f4"
                  },
                  {
                    "$text": "Pick a visible enemy unit within 18\" of this terrain feature to be the target.",
                    "name": "Declare",
                    "typeId": "bad3-f9c5-ba46-18cb"
                  },
                  {
                    "$text": "Roll a dice. Add 1 to the roll if this terrain feature has a Shouty Boss. On a 4+, pick 1 of the following effects to apply to the target until the start of your next turn:\n***Dat's Ours, Ya Git!:*** Subtract 3 from the target's control score.\n***Zog Off Wiv Ya Magic!:*** Subtract 1 from casting rolls and/or chanting rolls for the target.\n***Oi! Hold it!:*** Subtract 1 from the number of dice rolled when making charge rolls for the target, to a minimum of 1.",
                    "name": "Effect",
                    "typeId": "b6f1-ba36-6cd-3b03"
                  },
                  {
                    "name": "Keywords",
                    "typeId": "12e8-3214-7d8f-1d0f"
                  },
                  {
                    "name": "Used By",
                    "typeId": "1b32-c9d6-3106-166b"
                  }
                ],
                "attributes": [
                  {
                    "$text": "Yellow",
                    "name": "Color",
                    "typeId": "5a11-eab3-180c-ddf5"
                  },
                  {
                    "$text": "Special",
                    "name": "Type",
                    "typeId": "6d16-c86b-2698-85a4"
                  },
                  {
                    "name": "Parent Node",
                    "typeId": "2d74-4dcd-8468-87fa"
                  }
                ],
                "id": "40ac-68ad-a4eb-ea6a",
                "name": "Aggressively Bossy",
                "hidden": false,
                "typeId": "59b6-d47a-a68a-5dcc",
                "typeName": "Ability (Activated)",
                "from": "entry"
              },
              {
                "characteristics": [
                  {
                    "$text": "Your Movement Phase",
                    "name": "Timing",
                    "typeId": "652c-3d84-4e7-14f4"
                  },
                  {
                    "name": "Declare",
                    "typeId": "bad3-f9c5-ba46-18cb"
                  },
                  {
                    "$text": "If this terrain feature has a Shouty Boss that was not placed on it this turn, set up the Shouty Boss on the battlefield wholly within 6\" of this terrain feature and not in combat. That unit is no longer a Shouty Boss.",
                    "name": "Effect",
                    "typeId": "b6f1-ba36-6cd-3b03"
                  },
                  {
                    "name": "Keywords",
                    "typeId": "12e8-3214-7d8f-1d0f"
                  },
                  {
                    "name": "Used By",
                    "typeId": "1b32-c9d6-3106-166b"
                  }
                ],
                "attributes": [
                  {
                    "$text": "Gray",
                    "name": "Color",
                    "typeId": "5a11-eab3-180c-ddf5"
                  },
                  {
                    "$text": "Movement",
                    "name": "Type",
                    "typeId": "6d16-c86b-2698-85a4"
                  },
                  {
                    "name": "Parent Node",
                    "typeId": "2d74-4dcd-8468-87fa"
                  }
                ],
                "id": "fb9e-5498-9c49-7f52",
                "name": "I'm Off!",
                "hidden": false,
                "typeId": "59b6-d47a-a68a-5dcc",
                "typeName": "Ability (Activated)",
                "from": "entry"
              }
            ],
            "categories": [
              {
                "id": "cdd6-ffa1-9b32-4cb8",
                "entryId": "cdd6-ffa1-9b32-4cb8",
                "name": "FACTION TERRAIN",
                "primary": true
              },
              {
                "id": "c1ca-4b17-3512-89f",
                "name": "IRONJAWZ",
                "entryId": "c1ca-4b17-3512-89f",
                "primary": false
              },
              {
                "id": "9057-5a29-dda5-3c28",
                "name": "DESTRUCTION",
                "entryId": "9057-5a29-dda5-3c28",
                "primary": false
              }
            ],
            "id": "tkzi0k",
            "name": "Bossrokk Tower",
            "entryId": "73b0-a8fe-3e4b-391c::092c-1ddc-6678-db32",
            "number": 1,
            "type": "unit",
            "from": "entry"
          }
        ],
        "costs": [
          {
            "name": "Force Category - GHB",
            "typeId": "de92-2099-fbf7-a156",
            "value": 1
          }
        ],
        "categories": [
          {
            "name": "Configuration",
            "id": "k9tevfdn",
            "primary": false,
            "entryId": "676-2b78-7bbf-ba9c"
          },
          {
            "name": "Reference",
            "id": "wq68irr",
            "primary": false,
            "entryId": "3360-1158-e879-9606"
          },
          {
            "name": "Army Composition",
            "id": "sg6snmt",
            "primary": false,
            "entryId": "ac97-b27c-7e35-7ab9"
          },
          {
            "name": "FACTION TERRAIN",
            "id": "sgy1z3d",
            "primary": false,
            "entryId": "cdd6-ffa1-9b32-4cb8"
          },
          {
            "name": "Illegal Units",
            "id": "kahvee7",
            "primary": false,
            "entryId": "(Illegal Units)"
          }
        ],
        "forces": [
          {
            "selections": [
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "4\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "8",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "3+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "2",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "e8e5-8560-5331-37a",
                    "name": "Megaboss",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Reaction: You declared a **^^Fight^^** ability for this unit",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Pick a friendly **^^Brute^^** unit that has not used a **^^Fight^^** ability  this turn and is within this unit's combat range to be the target. The  target can be picked to use a **^^Fight^^** ability immediately after the **^^Fight^^** ability used by this unit has been resolved. If it is picked to do so, add 1 to the Attacks characteristic of that unit's melee weapons for the rest of the turn.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Red",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "8557-bf37-78c7-ea5d",
                    "name": "Lead da Brutes",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "End of Any Turn",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "If any damage points were allocated to an enemy unit by this unit’s combat attacks this turn and that enemy unit has been destroyed, give this unit a **Waaagh! token**, to a maximum of 3.\nUntil the end of the next turn, add 1 to the Attacks characteristic of this unit’s weapons for each **Waaagh! token** it has.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Purple",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "fe7-6e6c-e3d5-cec8",
                    "name": "Strength From Victory",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this **^^Hero^^** is within the combat range of a friendly unit that is not a **^^Hero^^**:\n• Subtract 1 from hit rolls for shooting attacks that target this Hero.\n• If this **^^Hero^^** is **^^Infantry^^**, they cannot be picked as the target of shooting attacks made by models more than 12\" from them.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "3bc-444a-5cf8-e4d",
                    "name": "Guarded Hero",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "8",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "2+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "f6b3-b16f-c6c9-3fb9",
                            "name": "Boss-choppa",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "r8mgtav",
                        "name": "Boss-choppa",
                        "entryId": "4079-fb73-a4d7-7b0d::8200-bc1f-235c-d69e",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "r4snhhm",
                    "name": "Megaboss",
                    "entryId": "4079-fb73-a4d7-7b0d::1ba9-5017-6a18-2aee",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 140
                  }
                ],
                "categories": [
                  {
                    "id": "6e72-1656-d554-528a",
                    "name": "HERO",
                    "entryId": "6e72-1656-d554-528a",
                    "primary": false
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "entryId": "75d6-6995-dfcc-3898",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  },
                  {
                    "id": "d1f3-921c-b403-1106",
                    "entryId": "d1f3-921c-b403-1106",
                    "name": "Regimental Leader",
                    "primary": true
                  }
                ],
                "id": "r3hhqgd",
                "name": "Megaboss",
                "entryId": "4079-fb73-a4d7-7b0d::4e07-f63a-6315-b48b",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "4\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "6",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "3+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "2",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "cc6-c796-e3d2-f36f",
                    "name": "Ardboy Big Boss",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If a friendly **Ardboyz** unit wholly within 12\" of this unit uses the ‘Rally’ command, you can make 3 additional rally rolls of D6.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Yellow",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Rallying",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "4571-de81-edd8-8e28",
                    "name": "Iron-fisted Commander",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "Add 1 to shield bash rolls for friendly **Ardboyz** units while they are wholly within 12\" of this unit.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Red",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "1cd9-9771-5fc7-bf76",
                    "name": "Get Bashin'!",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this **^^Hero^^** is within the combat range of a friendly unit that is not a **^^Hero^^**:\n• Subtract 1 from hit rolls for shooting attacks that target this Hero.\n• If this **^^Hero^^** is **^^Infantry^^**, they cannot be picked as the target of shooting attacks made by models more than 12\" from them.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "3bc-444a-5cf8-e4d",
                    "name": "Guarded Hero",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "7",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "d5b-ba98-8893-3b58",
                            "name": "Boss-hacka and Choppa",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "u434f8m",
                        "name": "Boss-hacka and Choppa",
                        "entryId": "ba04-3602-ef65-10a5::77b9-1264-7344-c3",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "u0lqssr",
                    "name": "Ardboy Big Boss",
                    "entryId": "ba04-3602-ef65-10a5::57ae-a31-338e-741e",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 100
                  }
                ],
                "categories": [
                  {
                    "id": "6e72-1656-d554-528a",
                    "entryId": "6e72-1656-d554-528a",
                    "name": "HERO",
                    "primary": true
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "entryId": "75d6-6995-dfcc-3898",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  },
                  {
                    "id": "8f4b-1fa6-3128-8405",
                    "name": "Regimental Hero",
                    "entryId": "8f4b-1fa6-3128-8405",
                    "primary": false
                  },
                  {
                    "id": "9e01-f4e1-28d8-eae4",
                    "name": "Headstompa",
                    "entryId": "9e01-f4e1-28d8-eae4",
                    "primary": false
                  }
                ],
                "id": "tzot9wh",
                "name": "Ardboy Big Boss",
                "entryId": "ba04-3602-ef65-10a5::e020-20c4-a638-6d2b",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "4\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "2",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "3+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "1",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "50b6-e26b-7d7d-378",
                    "name": "Ardboyz",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Any Combat Phase",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "Pick an enemy unit within 1\" of this unit to be the target.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Make a shield bash roll of D6 for each model in this unit that is within 3\" of the target. For each 6+, inflict 1 mortal damage on the target.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Red",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "bbd6-2236-da77-3f8b",
                    "name": "Shield Bash",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "2",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Anti-charge (+1 Rend)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "3b35-41ac-88ac-5780",
                            "name": "Choppa or Stikka",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "llmwfir",
                        "name": "Choppa or Stikka",
                        "entryId": "7355-7efd-73c7-8cd7::58ed-25ad-af05-8603",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "Add 1 to the Attacks characteristic of weapons used by champions in this unit.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Offensive",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "6ba-36a4-3848-65d1",
                            "name": "Champion",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "ll6t37",
                        "name": "Champion",
                        "entryId": "7355-7efd-73c7-8cd7::5314-89ab-1db9-dc18::9c21-1746-9873-a5b5",
                        "entryGroupId": "7355-7efd-73c7-8cd7::3b9f-2def-e0d5-9828",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "ll6l1awp",
                    "name": "Ardboy",
                    "entryId": "7355-7efd-73c7-8cd7::a2ef-910f-edbf-dbb6",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "2",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Anti-charge (+1 Rend)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "3b35-41ac-88ac-5780",
                            "name": "Choppa or Stikka",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "ln5gmk",
                        "name": "Choppa or Stikka",
                        "entryId": "7355-7efd-73c7-8cd7::58ed-25ad-af05-8603",
                        "number": 2,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "While this unit contains any standard bearers, add 1 to this unit’s control score.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Purple",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Control",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "1ec9-5b34-74df-6e40",
                            "name": "Standard Bearer",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "ln1fzt4",
                        "name": "Standard Bearer",
                        "entryId": "7355-7efd-73c7-8cd7::add3-8fe5-ed29-430a::7f34-77c9-597-62c3",
                        "entryGroupId": "7355-7efd-73c7-8cd7::3b9f-2def-e0d5-9828",
                        "number": 2,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "lmpvug6",
                    "name": "Ardboy",
                    "entryId": "7355-7efd-73c7-8cd7::a2ef-910f-edbf-dbb6",
                    "number": 2,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "2",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Anti-charge (+1 Rend)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "3b35-41ac-88ac-5780",
                            "name": "Choppa or Stikka",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "lo30is",
                        "name": "Choppa or Stikka",
                        "entryId": "7355-7efd-73c7-8cd7::58ed-25ad-af05-8603",
                        "number": 17,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "loigxm",
                    "name": "Ardboy",
                    "entryId": "7355-7efd-73c7-8cd7::a2ef-910f-edbf-dbb6",
                    "number": 17,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "id": "lk3syp",
                    "name": "Reinforced",
                    "entryId": "7bb1-d81d-6877-f0b7::1b37-82b8-c062-eb82",
                    "number": 1,
                    "type": "upgrade",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 320
                  }
                ],
                "categories": [
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "entryId": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "primary": true
                  },
                  {
                    "id": "f679-3bcb-d664-9ac3",
                    "name": "CHAMPION",
                    "entryId": "f679-3bcb-d664-9ac3",
                    "primary": false
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "1f17-ad98-ada0-ccf",
                    "name": "STANDARD BEARER (1/10)",
                    "entryId": "1f17-ad98-ada0-ccf",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "lj53m3e",
                "name": "Ardboyz",
                "entryId": "7355-7efd-73c7-8cd7::f757-3f6b-a13a-546a",
                "number": 1,
                "type": "unit",
                "from": "entry"
              }
            ],
            "categories": [
              {
                "name": "Regimental Leader",
                "id": "ubw6z1",
                "primary": false,
                "entryId": "d1f3-921c-b403-1106"
              },
              {
                "name": "HERO",
                "id": "ubeb7y7",
                "primary": false,
                "entryId": "6e72-1656-d554-528a"
              },
              {
                "name": "INFANTRY",
                "id": "ubrmo4",
                "primary": false,
                "entryId": "75d6-6995-dfcc-3898"
              },
              {
                "name": "MONSTER",
                "id": "le68ixe",
                "primary": false,
                "entryId": "6d54-625c-d063-13e2"
              },
              {
                "name": "WAR MACHINE",
                "id": "leouuje",
                "primary": false,
                "entryId": "f7bc-b618-4b5d-2bae"
              },
              {
                "name": "CAVALRY",
                "id": "ley2gcp",
                "primary": false,
                "entryId": "926c-df8c-6841-d49e"
              },
              {
                "name": "BEAST",
                "id": "lerte43",
                "primary": false,
                "entryId": "b224-8c8e-ca93-9860"
              },
              {
                "name": "Illegal Units",
                "id": "lfsyg66",
                "primary": false,
                "entryId": "(Illegal Units)"
              }
            ],
            "id": "u7lj93",
            "name": "Regiment",
            "entryId": "48a1-e075-c797-5605::376a-6b97-8699-dd59",
            "catalogueId": "832c-fd6-a535-ffae",
            "catalogueRevision": 38,
            "catalogueName": "Ironjawz"
          },
          {
            "selections": [
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "4\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "8",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "3+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "2",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "e8e5-8560-5331-37a",
                    "name": "Megaboss",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Reaction: You declared a **^^Fight^^** ability for this unit",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Pick a friendly **^^Brute^^** unit that has not used a **^^Fight^^** ability  this turn and is within this unit's combat range to be the target. The  target can be picked to use a **^^Fight^^** ability immediately after the **^^Fight^^** ability used by this unit has been resolved. If it is picked to do so, add 1 to the Attacks characteristic of that unit's melee weapons for the rest of the turn.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Red",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "8557-bf37-78c7-ea5d",
                    "name": "Lead da Brutes",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "End of Any Turn",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "If any damage points were allocated to an enemy unit by this unit’s combat attacks this turn and that enemy unit has been destroyed, give this unit a **Waaagh! token**, to a maximum of 3.\nUntil the end of the next turn, add 1 to the Attacks characteristic of this unit’s weapons for each **Waaagh! token** it has.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Purple",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "fe7-6e6c-e3d5-cec8",
                    "name": "Strength From Victory",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this **^^Hero^^** is within the combat range of a friendly unit that is not a **^^Hero^^**:\n• Subtract 1 from hit rolls for shooting attacks that target this Hero.\n• If this **^^Hero^^** is **^^Infantry^^**, they cannot be picked as the target of shooting attacks made by models more than 12\" from them.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "3bc-444a-5cf8-e4d",
                    "name": "Guarded Hero",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "id": "dia7b8j",
                    "name": "General",
                    "entryId": "4079-fb73-a4d7-7b0d::87e5-8fcf-9d12-f05b::a56b-952e-ad15-7868",
                    "number": 1,
                    "type": "upgrade",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "8",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "2+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "f6b3-b16f-c6c9-3fb9",
                            "name": "Boss-choppa",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "dm57b25",
                        "name": "Boss-choppa",
                        "entryId": "4079-fb73-a4d7-7b0d::8200-bc1f-235c-d69e",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "dirxrb5",
                    "name": "Megaboss",
                    "entryId": "4079-fb73-a4d7-7b0d::1ba9-5017-6a18-2aee",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "name": "Keywords",
                            "typeId": "b977-7c5e-33b2-428e"
                          },
                          {
                            "$text": "Add 10 to this unit’s control score.",
                            "name": "Effect",
                            "typeId": "fd7f-888d-3257-a12b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Purple",
                            "name": "Color",
                            "typeId": "50fe-4f29-6bc3-dcc6"
                          },
                          {
                            "$text": "Control",
                            "name": "Type",
                            "typeId": "bf11-4e10-3ab1-06f4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "e2e1-15ca-d345-22b8"
                          }
                        ],
                        "id": "5883-f5fe-1170-3995",
                        "name": "Trophy Skulls",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      }
                    ],
                    "id": "dly8gor",
                    "name": "Trophy Skulls",
                    "entryId": "dc45-940f-4711-ef50::bfe4-ee9c-3d28-7a61",
                    "entryGroupId": "dc45-940f-4711-ef50::e6f7-4835-b77d-4052",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Artefacts of Power::Da Boss's Hoard"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Any Charge Phase",
                            "name": "Timing",
                            "typeId": "652c-3d84-4e7-14f4"
                          },
                          {
                            "$text": "If this unit charged this turn, pick an enemy unit within 1\" of it to be the target.",
                            "name": "Declare",
                            "typeId": "bad3-f9c5-ba46-18cb"
                          },
                          {
                            "$text": "Roll a D3. On a 2+, inflict an amount of mortal damage on the target equal to the roll. If this unit’s unmodified charge roll this turn was 8+, roll a D6 instead of a D3.",
                            "name": "Effect",
                            "typeId": "b6f1-ba36-6cd-3b03"
                          },
                          {
                            "name": "Keywords",
                            "typeId": "12e8-3214-7d8f-1d0f"
                          },
                          {
                            "name": "Used By",
                            "typeId": "1b32-c9d6-3106-166b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Orange",
                            "name": "Color",
                            "typeId": "5a11-eab3-180c-ddf5"
                          },
                          {
                            "$text": "Offensive",
                            "name": "Type",
                            "typeId": "6d16-c86b-2698-85a4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "2d74-4dcd-8468-87fa"
                          }
                        ],
                        "id": "26e9-2561-78fd-e0cd",
                        "name": "Hulking Brute",
                        "hidden": false,
                        "typeId": "59b6-d47a-a68a-5dcc",
                        "typeName": "Ability (Activated)",
                        "from": "entry"
                      }
                    ],
                    "id": "dk7txv",
                    "name": "Hulking Brute",
                    "entryId": "54e3-a743-a427-ecce::ebbf-ad8f-14de-47d1",
                    "entryGroupId": "54e3-a743-a427-ecce::5213-e13d-7e64-9f74",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Heroic Traits::Brutal Warlords"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 140
                  }
                ],
                "categories": [
                  {
                    "id": "6e72-1656-d554-528a",
                    "name": "HERO",
                    "entryId": "6e72-1656-d554-528a",
                    "primary": false
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "entryId": "75d6-6995-dfcc-3898",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  },
                  {
                    "id": "d1f3-921c-b403-1106",
                    "entryId": "d1f3-921c-b403-1106",
                    "name": "Regimental Leader",
                    "primary": true
                  }
                ],
                "id": "dinimxo",
                "name": "Megaboss",
                "entryId": "4079-fb73-a4d7-7b0d::4e07-f63a-6315-b48b",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "4\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "7",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "3+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "2",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "1742-12cd-419a-69d9",
                    "name": "Zoggrok Anvilsmasha",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "**Klonk** is a token. You can re-roll forgin’ rolls for this unit while this unit’s **Klonk** is on the battlefield. If you make an unmodified save roll of 1 for this unit, remove this unit’s **Klonk** from the battlefield after the **^^Attack^^** ability has been resolved (the damage point is still inflicted).",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Special",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "2f1e-9a5-dca3-bac8",
                    "name": "Klonk",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Your Hero Phase",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "Pick a visible friendly **^^Ironjawz Infantry^^** unit wholly within 12\" of this unit to be the target.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Make a forgin’ roll of D6. Add 1 to the roll if this unit is armed with **Grunta-tongs**. On a 4+, the target’s melee weapons have **Crit (Mortal)** until the start of your next turn.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Yellow",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "be8b-b8e0-cf66-346f",
                    "name": "Power of da Great Green God",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this **^^Hero^^** is within the combat range of a friendly unit that is not a **^^Hero^^**:\n• Subtract 1 from hit rolls for shooting attacks that target this Hero.\n• If this **^^Hero^^** is **^^Infantry^^**, they cannot be picked as the target of shooting attacks made by models more than 12\" from them.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "3bc-444a-5cf8-e4d",
                    "name": "Guarded Hero",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "5",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "2+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "1ebb-28f2-83bc-6ac3",
                            "name": "Skull-crushing Basha",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "09eipl",
                        "name": "Skull-crushing Basha",
                        "entryId": "8627-4cd3-fc78-9e8c::7a83-64e6-f12a-1fa5",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "If an attack made with this unit’s **^^Ward-smashing Choppa^^** scores a hit, the target has the **^^Ward‑smashed^^** keyword for the rest of the battle. Ward rolls cannot be made for a **^^Ward‑smashed^^** unit even if this unit has been destroyed.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Special",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "b182-de76-e880-783",
                            "name": "Ward-smashing Choppa",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "selections": [
                          {
                            "profiles": [
                              {
                                "characteristics": [
                                  {
                                    "$text": "2",
                                    "name": "Atk",
                                    "typeId": "60e-35aa-31ed-e488"
                                  },
                                  {
                                    "$text": "4+",
                                    "name": "Hit",
                                    "typeId": "26dc-168-b2fd-cb93"
                                  },
                                  {
                                    "$text": "2+",
                                    "name": "Wnd",
                                    "typeId": "61c1-22cc-40af-2847"
                                  },
                                  {
                                    "$text": "2",
                                    "name": "Rnd",
                                    "typeId": "eccc-10fa-6958-fb73"
                                  },
                                  {
                                    "$text": "3",
                                    "name": "Dmg",
                                    "typeId": "e948-9c71-12a6-6be4"
                                  },
                                  {
                                    "$text": "-",
                                    "name": "Ability",
                                    "typeId": "eda3-7332-5db1-4159"
                                  }
                                ],
                                "id": "7a6a-eeda-a7a5-5063",
                                "name": "Ward-smashing Choppa",
                                "hidden": false,
                                "typeId": "9074-76b6-9e2f-81e3",
                                "typeName": "Melee Weapon",
                                "from": "entry"
                              }
                            ],
                            "id": "0xoj6cj",
                            "name": "Ward-smashing Choppa",
                            "entryId": "8627-4cd3-fc78-9e8c::bf78-62ba-7214-adf7",
                            "number": 1,
                            "type": "upgrade",
                            "from": "entry"
                          }
                        ],
                        "id": "09t38jc",
                        "name": "Ward-smashing Choppa",
                        "entryId": "8627-4cd3-fc78-9e8c::9a6d-cb22-261f-c3e0",
                        "entryGroupId": "8627-4cd3-fc78-9e8c::4d33-dc6e-caeb-57e",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Wargear Options"
                      }
                    ],
                    "id": "072mjbb",
                    "name": "Zoggrok Anvilsmasha",
                    "entryId": "8627-4cd3-fc78-9e8c::7c7d-23f9-7593-d940",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 160
                  }
                ],
                "categories": [
                  {
                    "id": "6e72-1656-d554-528a",
                    "entryId": "6e72-1656-d554-528a",
                    "name": "HERO",
                    "primary": true
                  },
                  {
                    "id": "72ce-2188-70bf-2dbd",
                    "name": "UNIQUE",
                    "entryId": "72ce-2188-70bf-2dbd",
                    "primary": false
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "entryId": "75d6-6995-dfcc-3898",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  },
                  {
                    "id": "8f4b-1fa6-3128-8405",
                    "name": "Regimental Hero",
                    "entryId": "8f4b-1fa6-3128-8405",
                    "primary": false
                  },
                  {
                    "id": "9e01-f4e1-28d8-eae4",
                    "name": "Headstompa",
                    "entryId": "9e01-f4e1-28d8-eae4",
                    "primary": false
                  }
                ],
                "id": "07c4bp",
                "name": "Zoggrok Anvilsmasha",
                "entryId": "8627-4cd3-fc78-9e8c::d4c-6af5-1346-a8ab",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "4\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "3",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "3+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "1",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "3d8a-a014-503b-814e",
                    "name": "Brutes",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "Enemy units with a Health characteristic of 1 or 2 cannot contest objectives while they are in combat with this unit.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Purple",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Control",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "84e0-ee80-ff6f-2999",
                    "name": "You Messin'?",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Anti-**^^Infantry^^** (+1 Rend)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "65e4-dee1-d6e6-3c57",
                            "name": "Brute Weapons",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "vq2b9gl",
                        "name": "Brute Weapons",
                        "entryId": "12e-804f-876e-1c7::630f-c582-b845-f9",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "Add 1 to the Attacks characteristic of weapons used by champions in this unit.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Offensive",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "6ba-36a4-3848-65d1",
                            "name": "Champion",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "vrhgg0x",
                        "name": "Champion",
                        "entryId": "12e-804f-876e-1c7::815e-1538-5f77-aeb6::9c21-1746-9873-a5b5",
                        "entryGroupId": "12e-804f-876e-1c7::90b-84f4-29e-ab3",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "vqh8rfsw",
                    "name": "Brute",
                    "entryId": "12e-804f-876e-1c7::5559-a21d-9ee1-998",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "2",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "3",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "aa68-d9d8-638a-7a60",
                            "name": "Gore-choppa",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "vswalw",
                        "name": "Gore-choppa",
                        "entryId": "12e-804f-876e-1c7::5b38-2970-e289-5dfa",
                        "number": 2,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "vrfodp",
                    "name": "Brute",
                    "entryId": "12e-804f-876e-1c7::5559-a21d-9ee1-998",
                    "number": 2,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Anti-**^^Infantry^^** (+1 Rend)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "65e4-dee1-d6e6-3c57",
                            "name": "Brute Weapons",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "vs74n96",
                        "name": "Brute Weapons",
                        "entryId": "12e-804f-876e-1c7::630f-c582-b845-f9",
                        "number": 7,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "vsm9qru",
                    "name": "Brute",
                    "entryId": "12e-804f-876e-1c7::5559-a21d-9ee1-998",
                    "number": 7,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "id": "vpf1yvh",
                    "name": "Reinforced",
                    "entryId": "678-8a55-7ab4-95b6::1b37-82b8-c062-eb82",
                    "number": 1,
                    "type": "upgrade",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 320
                  }
                ],
                "categories": [
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "entryId": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "primary": true
                  },
                  {
                    "id": "f679-3bcb-d664-9ac3",
                    "name": "CHAMPION",
                    "entryId": "f679-3bcb-d664-9ac3",
                    "primary": false
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "2461-b51f-dc6-3114",
                    "name": "BRUTE",
                    "entryId": "2461-b51f-dc6-3114",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "vod3e0b",
                "name": "Brutes",
                "entryId": "12e-804f-876e-1c7::f330-c2f2-f018-d93b",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "4\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "3",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "3+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "1",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "3d8a-a014-503b-814e",
                    "name": "Brutes",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "Enemy units with a Health characteristic of 1 or 2 cannot contest objectives while they are in combat with this unit.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Purple",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Control",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "84e0-ee80-ff6f-2999",
                    "name": "You Messin'?",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Anti-**^^Infantry^^** (+1 Rend)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "65e4-dee1-d6e6-3c57",
                            "name": "Brute Weapons",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "4q4ywk7d",
                        "name": "Brute Weapons",
                        "entryId": "12e-804f-876e-1c7::630f-c582-b845-f9",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "Add 1 to the Attacks characteristic of weapons used by champions in this unit.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Offensive",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "6ba-36a4-3848-65d1",
                            "name": "Champion",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "4qa5mih",
                        "name": "Champion",
                        "entryId": "12e-804f-876e-1c7::815e-1538-5f77-aeb6::9c21-1746-9873-a5b5",
                        "entryGroupId": "12e-804f-876e-1c7::90b-84f4-29e-ab3",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "4pzbax5",
                    "name": "Brute",
                    "entryId": "12e-804f-876e-1c7::5559-a21d-9ee1-998",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "2",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "3",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "aa68-d9d8-638a-7a60",
                            "name": "Gore-choppa",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "4rbzf4n",
                        "name": "Gore-choppa",
                        "entryId": "12e-804f-876e-1c7::5b38-2970-e289-5dfa",
                        "number": 2,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "4qbdlwq",
                    "name": "Brute",
                    "entryId": "12e-804f-876e-1c7::5559-a21d-9ee1-998",
                    "number": 2,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Anti-**^^Infantry^^** (+1 Rend)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "65e4-dee1-d6e6-3c57",
                            "name": "Brute Weapons",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "4rjabe",
                        "name": "Brute Weapons",
                        "entryId": "12e-804f-876e-1c7::630f-c582-b845-f9",
                        "number": 7,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "4rixzr5",
                    "name": "Brute",
                    "entryId": "12e-804f-876e-1c7::5559-a21d-9ee1-998",
                    "number": 7,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "id": "4dblk0g",
                    "name": "Reinforced",
                    "entryId": "678-8a55-7ab4-95b6::1b37-82b8-c062-eb82",
                    "number": 1,
                    "type": "upgrade",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 320
                  }
                ],
                "categories": [
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "entryId": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "primary": true
                  },
                  {
                    "id": "f679-3bcb-d664-9ac3",
                    "name": "CHAMPION",
                    "entryId": "f679-3bcb-d664-9ac3",
                    "primary": false
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "2461-b51f-dc6-3114",
                    "name": "BRUTE",
                    "entryId": "2461-b51f-dc6-3114",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "6a08fd11cfbe8e2eac322a16",
                "name": "Brutes",
                "entryId": "12e-804f-876e-1c7::f330-c2f2-f018-d93b",
                "number": 1,
                "type": "unit",
                "from": "entry"
              }
            ],
            "categories": [
              {
                "name": "Regimental Leader",
                "id": "1n9pmn",
                "primary": false,
                "entryId": "d1f3-921c-b403-1106"
              },
              {
                "name": "HERO",
                "id": "1nsxaam",
                "primary": false,
                "entryId": "6e72-1656-d554-528a"
              },
              {
                "name": "INFANTRY",
                "id": "1n0fjsc",
                "primary": false,
                "entryId": "75d6-6995-dfcc-3898"
              },
              {
                "name": "MONSTER",
                "id": "manpw4s",
                "primary": false,
                "entryId": "6d54-625c-d063-13e2"
              },
              {
                "name": "WAR MACHINE",
                "id": "mar8ras",
                "primary": false,
                "entryId": "f7bc-b618-4b5d-2bae"
              },
              {
                "name": "CAVALRY",
                "id": "majmdv",
                "primary": false,
                "entryId": "926c-df8c-6841-d49e"
              },
              {
                "name": "BEAST",
                "id": "ma7qpu",
                "primary": false,
                "entryId": "b224-8c8e-ca93-9860"
              },
              {
                "name": "Illegal Units",
                "id": "maye48",
                "primary": false,
                "entryId": "(Illegal Units)"
              }
            ],
            "id": "1mgvdof",
            "name": "Regiment",
            "entryId": "48a1-e075-c797-5605::376a-6b97-8699-dd59",
            "catalogueId": "832c-fd6-a535-ffae",
            "catalogueRevision": 38,
            "catalogueName": "Ironjawz"
          },
          {
            "selections": [
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "4\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "6",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "6+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "2",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "74-e154-5b4-4632",
                    "name": "Weirdnob Shaman",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "Add 1 to this unit’s power level while there are any friendly **^^Ironjawz^^** units that have 10 or more models wholly within 12\" of it.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Yellow",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Special",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "73a6-66b9-f6f-4cf7",
                    "name": "Brutal Power",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this **^^Hero^^** is within the combat range of a friendly unit that is not a **^^Hero^^**:\n• Subtract 1 from hit rolls for shooting attacks that target this Hero.\n• If this **^^Hero^^** is **^^Infantry^^**, they cannot be picked as the target of shooting attacks made by models more than 12\" from them.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "3bc-444a-5cf8-e4d",
                    "name": "Guarded Hero",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "10\"",
                                "name": "Rng",
                                "typeId": "c6b5-908c-a604-1a98"
                              },
                              {
                                "$text": "4",
                                "name": "Atk",
                                "typeId": "aa17-4296-2887-e05d"
                              },
                              {
                                "$text": "2+",
                                "name": "Hit",
                                "typeId": "194d-aeb6-5ba7-83b4"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "d3d5-9dc6-13de-8d1"
                              },
                              {
                                "$text": "-",
                                "name": "Rnd",
                                "typeId": "d03f-a9ae-3eec-755"
                              },
                              {
                                "$text": "D3",
                                "name": "Dmg",
                                "typeId": "96c2-d0a5-ea1e-653b"
                              },
                              {
                                "$text": "Shoot in Combat",
                                "name": "Ability",
                                "typeId": "d793-3dd7-9c13-741e"
                              }
                            ],
                            "id": "607e-d739-f806-fdb3",
                            "name": "Green Puke",
                            "hidden": false,
                            "typeId": "1fd-a42f-41d3-fe05",
                            "typeName": "Ranged Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "z3bnph",
                        "name": "Green Puke",
                        "entryId": "da11-fae6-a09f-d32c::4f3f-8f01-ac9c-d6a2",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "D3",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "ddcc-d3df-1179-36d",
                            "name": "Waaagh! Staff",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "z32jl89",
                        "name": "Waaagh! Staff",
                        "entryId": "da11-fae6-a09f-d32c::217-a68-7955-6a2",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "yvr5o2",
                    "name": "Weirdnob Shaman",
                    "entryId": "da11-fae6-a09f-d32c::d5ca-4205-5103-d53b",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 110
                  }
                ],
                "categories": [
                  {
                    "id": "6e72-1656-d554-528a",
                    "name": "HERO",
                    "entryId": "6e72-1656-d554-528a",
                    "primary": false
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "entryId": "75d6-6995-dfcc-3898",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "6f28-c3f6-4b1b-8aff",
                    "name": "WIZARD (1)",
                    "entryId": "6f28-c3f6-4b1b-8aff",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  },
                  {
                    "id": "d1f3-921c-b403-1106",
                    "entryId": "d1f3-921c-b403-1106",
                    "name": "Regimental Leader",
                    "primary": true
                  }
                ],
                "id": "yqjiilb",
                "name": "Weirdnob Shaman",
                "entryId": "da11-fae6-a09f-d32c::e824-4e07-12f6-309c",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "9\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "5",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "3+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "2",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "f86c-962b-5a17-1191",
                    "name": "Gore-gruntas",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "When this unit moves, it can pass through models in enemy **^^Infantry^^** units and can pass through the combat ranges of enemy **Infantry** units, but it cannot end the move in combat unless specified in the ability used.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Movement",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "c154-aa9b-2841-db6d",
                    "name": "Barge Through",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Charge (+1 Damage)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "5bb9-0230-4c86-e7f3",
                            "name": "Choppa or Hacka",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "w4s4db",
                        "name": "Choppa or Hacka",
                        "entryId": "a5b1-87fd-de33-6269::8fd9-77b3-77e0-6339",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "2+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Charge (+1 Damage), Companion",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "0e67-fa6f-6232-bc87",
                            "name": "Grunta’s Tusks",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "w4u1eqo",
                        "name": "Grunta’s Tusks",
                        "entryId": "a5b1-87fd-de33-6269::b279-0b53-f58a-4587",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "Add 1 to the Attacks characteristic of weapons used by champions in this unit.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Offensive",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "6ba-36a4-3848-65d1",
                            "name": "Champion",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "w4i1zee",
                        "name": "Champion",
                        "entryId": "a5b1-87fd-de33-6269::9694-d0a1-d64b-e1ad::9c21-1746-9873-a5b5",
                        "entryGroupId": "a5b1-87fd-de33-6269::785a-b08c-0d5f-64d4",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "w27rt5",
                    "name": "Gore-grunta",
                    "entryId": "a5b1-87fd-de33-6269::e87c-d645-17fc-c7fe",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Charge (+1 Damage)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "5bb9-0230-4c86-e7f3",
                            "name": "Choppa or Hacka",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "w5q2ssn",
                        "name": "Choppa or Hacka",
                        "entryId": "a5b1-87fd-de33-6269::8fd9-77b3-77e0-6339",
                        "number": 2,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "2+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Charge (+1 Damage), Companion",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "0e67-fa6f-6232-bc87",
                            "name": "Grunta’s Tusks",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "w53n07",
                        "name": "Grunta’s Tusks",
                        "entryId": "a5b1-87fd-de33-6269::b279-0b53-f58a-4587",
                        "number": 2,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "w40a5q",
                    "name": "Gore-grunta",
                    "entryId": "a5b1-87fd-de33-6269::e87c-d645-17fc-c7fe",
                    "number": 2,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 170
                  }
                ],
                "categories": [
                  {
                    "id": "f679-3bcb-d664-9ac3",
                    "name": "CHAMPION",
                    "entryId": "f679-3bcb-d664-9ac3",
                    "primary": false
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "926c-df8c-6841-d49e",
                    "entryId": "926c-df8c-6841-d49e",
                    "name": "CAVALRY",
                    "primary": true
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "vzky68u",
                "name": "Gore-gruntas (Scourge of Ghyran)",
                "entryId": "a5b1-87fd-de33-6269::f0c2-47b3-2266-1a6f",
                "number": 1,
                "type": "unit",
                "from": "entry"
              }
            ],
            "categories": [
              {
                "name": "Regimental Leader",
                "id": "1sh96qr",
                "primary": false,
                "entryId": "d1f3-921c-b403-1106"
              },
              {
                "name": "HERO",
                "id": "n22shr",
                "primary": false,
                "entryId": "6e72-1656-d554-528a"
              },
              {
                "name": "INFANTRY",
                "id": "n2rsco8",
                "primary": false,
                "entryId": "75d6-6995-dfcc-3898"
              },
              {
                "name": "MONSTER",
                "id": "n2m0vcr",
                "primary": false,
                "entryId": "6d54-625c-d063-13e2"
              },
              {
                "name": "WAR MACHINE",
                "id": "n3cdkso",
                "primary": false,
                "entryId": "f7bc-b618-4b5d-2bae"
              },
              {
                "name": "CAVALRY",
                "id": "1umjwtl",
                "primary": false,
                "entryId": "926c-df8c-6841-d49e"
              },
              {
                "name": "BEAST",
                "id": "n3xh39h",
                "primary": false,
                "entryId": "b224-8c8e-ca93-9860"
              },
              {
                "name": "Illegal Units",
                "id": "n3uxe3r",
                "primary": false,
                "entryId": "(Illegal Units)"
              }
            ],
            "id": "1o5tej",
            "name": "Regiment",
            "entryId": "48a1-e075-c797-5605::376a-6b97-8699-dd59",
            "catalogueId": "832c-fd6-a535-ffae",
            "catalogueRevision": 38,
            "catalogueName": "Ironjawz"
          },
          {
            "selections": [
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "4\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "6",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "4+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "2",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "da4f-b50-64a3-8545",
                    "name": "Warchanter",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "End of Any Turn",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "If any enemy models were slain this turn by this unit’s combat attacks, give this unit D3 ritual points.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Purple",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Special",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "1bd0-bd40-a9b8-eb02",
                    "name": "Rhythm of Destruction",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this **^^Hero^^** is within the combat range of a friendly unit that is not a **^^Hero^^**:\n• Subtract 1 from hit rolls for shooting attacks that target this Hero.\n• If this **^^Hero^^** is **^^Infantry^^**, they cannot be picked as the target of shooting attacks made by models more than 12\" from them.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "3bc-444a-5cf8-e4d",
                    "name": "Guarded Hero",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "6",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "-",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "D3",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "6044-1fcb-61c9-e15c",
                            "name": "Gorkstikk and Morkstikk",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "rfyoo5",
                        "name": "Gorkstikk and Morkstikk",
                        "entryId": "3076-d691-5aa5-3d56::48b5-d012-bc1a-a5e9",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "rb57o5",
                    "name": "Warchanter",
                    "entryId": "3076-d691-5aa5-3d56::b569-1b3-852c-eb58",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 110
                  }
                ],
                "categories": [
                  {
                    "id": "6e72-1656-d554-528a",
                    "name": "HERO",
                    "entryId": "6e72-1656-d554-528a",
                    "primary": false
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "entryId": "75d6-6995-dfcc-3898",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "3fe-84f4-cec6-a1c1",
                    "name": "PRIEST (1)",
                    "entryId": "3fe-84f4-cec6-a1c1",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  },
                  {
                    "id": "d1f3-921c-b403-1106",
                    "entryId": "d1f3-921c-b403-1106",
                    "name": "Regimental Leader",
                    "primary": true
                  }
                ],
                "id": "radlzyr",
                "name": "Warchanter",
                "entryId": "3076-d691-5aa5-3d56::7d89-20b4-7ed4-6ca0",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "4\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "3",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "5+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "1",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "d77e-2fed-840f-0b00",
                    "name": "Weirdbrute Wrekkaz",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Once Per Turn (Army), Any Combat Phase",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "If this unit is in combat, pick a friendly **^^Ironjawz^^** unit wholly within 12\" of this unit to be the target.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Add 1 to hit rolls for the target's combat attacks for the rest of the turn.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Red",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "f84a-7178-3587-ece0",
                    "name": "Propa Wonky",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "In step 1 of the damage sequence (see 18.0), make a **ward roll** of D6 for each **damage point** in this unit’s **damage pool**. If the roll equals or exceeds this unit’s **ward value**, remove that damage point from the damage pool.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "ed70-f30-2f5a-747f",
                    "name": "Ward Save",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "6",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Anti-**^^Infantry^^** (+1 Rend)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "6c35-bed7-0204-7344",
                            "name": "Chain-smasha",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "fezzlm",
                        "name": "Chain-smasha",
                        "entryId": "f72d-b3ff-d7d8-f342::7577-8e95-7e3e-b55c",
                        "number": 3,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "fdmlv",
                    "name": "Weirdbrute Wrekka",
                    "entryId": "f72d-b3ff-d7d8-f342::12b2-bbae-85c5-9acb",
                    "number": 3,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 90
                  }
                ],
                "categories": [
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "entryId": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "primary": true
                  },
                  {
                    "id": "9057-5a29-dda5-3c28",
                    "name": "DESTRUCTION",
                    "entryId": "9057-5a29-dda5-3c28",
                    "primary": false
                  },
                  {
                    "id": "c1ca-4b17-3512-89f",
                    "name": "IRONJAWZ",
                    "entryId": "c1ca-4b17-3512-89f",
                    "primary": false
                  },
                  {
                    "id": "2461-b51f-dc6-3114",
                    "name": "BRUTE",
                    "entryId": "2461-b51f-dc6-3114",
                    "primary": false
                  },
                  {
                    "id": "52cc-95fd-6cd3-8f72",
                    "name": "WARD (5+)",
                    "entryId": "52cc-95fd-6cd3-8f72",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "fbtdl74",
                "name": "Weirdbrute Wrekkaz (Scourge of Ghyran)",
                "entryId": "f72d-b3ff-d7d8-f342::9582-7259-1066-5bb5",
                "number": 1,
                "type": "unit",
                "from": "entry"
              }
            ],
            "categories": [
              {
                "name": "Regimental Leader",
                "id": "406hbys",
                "primary": false,
                "entryId": "d1f3-921c-b403-1106"
              },
              {
                "name": "HERO",
                "id": "nrqmr4m",
                "primary": false,
                "entryId": "6e72-1656-d554-528a"
              },
              {
                "name": "INFANTRY",
                "id": "404xq9c",
                "primary": false,
                "entryId": "75d6-6995-dfcc-3898"
              },
              {
                "name": "MONSTER",
                "id": "nsfcm5r",
                "primary": false,
                "entryId": "6d54-625c-d063-13e2"
              },
              {
                "name": "WAR MACHINE",
                "id": "nschgdk",
                "primary": false,
                "entryId": "f7bc-b618-4b5d-2bae"
              },
              {
                "name": "CAVALRY",
                "id": "nsmac8dt",
                "primary": false,
                "entryId": "926c-df8c-6841-d49e"
              },
              {
                "name": "BEAST",
                "id": "ns92asv",
                "primary": false,
                "entryId": "b224-8c8e-ca93-9860"
              },
              {
                "name": "Illegal Units",
                "id": "nsfdql4",
                "primary": false,
                "entryId": "(Illegal Units)"
              }
            ],
            "id": "3yd5q32",
            "name": "Regiment",
            "entryId": "48a1-e075-c797-5605::376a-6b97-8699-dd59",
            "catalogueId": "832c-fd6-a535-ffae",
            "catalogueRevision": 38,
            "catalogueName": "Ironjawz"
          }
        ],
        "id": "s9hwo77",
        "name": "✦ General's Handbook 2025-26",
        "entryId": "f079-501a-2738-6845",
        "catalogueId": "832c-fd6-a535-ffae",
        "catalogueRevision": 38,
        "catalogueName": "Ironjawz"
      }
    ],
    "id": "rwgzjqj",
    "name": "2k List",
    "battleScribeVersion": 2.03,
    "generatedBy": "https://newrecruit.eu",
    "gameSystemId": "e51d-b1a3-75fc-dc3g",
    "gameSystemName": "Age of Sigmar 4.0",
    "gameSystemRevision": 94,
    "xmlns": "http://www.battlescribe.net/schema/rosterSchema"
  }
};
