/**
 * Example BattleScribe roster JSON used by the 'Load Example' button.
 * Contains Hedonites of Slaanesh with various ability types for testing.
 */
export const exampleRoster =
  {
      "roster": {
        "costs": [
          {
            "name": "pts",
            "typeId": "points",
            "value": 2000
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
                        "$text": "Your Hero Phase",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "Pick an enemy unit within 18\" of this model to be the target.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Heal (3) this model, or instead make a **Blast** action targeting the enemy unit.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "$text": "Spell",
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "$text": "5",
                        "name": "Casting Value",
                        "typeId": "f99c-3f8e-5e5e-1a0a"
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
                      }
                    ],
                    "id": "5e45-93e3-812-ec15",
                    "name": "Test Spell",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Spell)",
                    "from": "entry"
                  }
                ],
                "id": "wizard-hero-001",
                "name": "Wizard Hero (3)",
                "entryId": "wizard-entry-001",
                "number": 1,
                "type": "model",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "Once Per Battle Round (Army), Start of Battle Round",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "Pick up to 3 friendly **Hedonites of Slaanesh** units to be the targets.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "The targets have the **Euphoric** keyword for the rest of the battle round.\nIn addition, for each friendly unit you pick, give your opponent 1 temptation dice. During this battle round,\ninstead of making a wound roll, save roll, ward roll or run roll, your opponent can use 1 temptation dice to replace the roll they would have made with a 6, or instead of making a charge roll they can use 2 temptation dice to replace 2 of the dice in a charge roll with two 6s (other dice could then be rolled normally). Rolls that have been replaced count as unmodified rolls and cannot be re-rolled. You cannot use temptation dice to replace a re-roll.\nEach time your opponent uses a temptation dice, they must roll it. On a 1-2, your opponent's roll is replaced by that value instead of a 6, and you must allocate D3 damage points to the unit for which the roll was replaced immediately after the ability used by that unit has been resolved (ward rolls cannot be made for those damage points).\nAt the end of the battle round, any temptation dice that have not been used are lost.",
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
                        "$text": "Black",
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
                    "id": "5e45-93e3-812-ec14",
                    "name": "An Excess of Depravity",
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
                        "$text": "While a friendly unit has the Euphoric keyword:\n• That unit's weapons, including Companion weapons, have Crit (2 Hits).\n• That unit can use a Run ability and still use Shoot and/or Charge abilities later in the turn.\n\n\nDesigner’s Note: Note that 'Sadistic Spite' does not affect Companion weapons.",
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
                    "id": "f71a-320b-cc60-c9ff",
                    "name": "Euphoric Killers",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
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
                "id": "xwulopg",
                "name": "Battle Traits: Hedonites of Slaanesh",
                "entryId": "9eab-ba5b-5d29-3c72::77b8-2e38-40f0-4472",
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
                        ],
                        "id": "0184-bec1-4f4f-b17e",
                        "name": "Ecstatic Revellers",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      }
                    ],
                    "costs": [
                      {
                        "name": "pts",
                        "typeId": "points",
                        "value": 10
                      }
                    ],
                    "id": "is8r29f",
                    "name": "Invaders",
                    "entryId": "cf91-d723-589f-6e22::3adc-4841-c235-4584",
                    "entryGroupId": "cf91-d723-589f-6e22::22cc-a0d6-614c-3468",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Battle Formations: Hedonites of Slaanesh"
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
                "id": "467zb6",
                "name": "Battle Formation",
                "entryId": "9fe3-ad15-6800-71f7",
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
                        ],
                        "id": "c45f-dc73-39f3-24c9",
                        "name": "Master the Paths",
                        "hidden": false,
                        "typeId": "abf8-a239-9e66-54c1",
                        "typeName": "Battle Tactic Card",
                        "from": "entry"
                      }
                    ],
                    "id": "it1nhl5",
                    "name": "Master the Paths",
                    "entryId": "f5d1-f1d9-1dd5-5061",
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
                        ],
                        "id": "a365-06ad-19a1-528d",
                        "name": "Intercept and Recover",
                        "hidden": false,
                        "typeId": "abf8-a239-9e66-54c1",
                        "typeName": "Battle Tactic Card",
                        "from": "entry"
                      }
                    ],
                    "id": "itjdago",
                    "name": "Intercept and Recover",
                    "entryId": "545c-5467-b8b6-2b1b",
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
                "id": "48k257",
                "name": "Battle Tactic Cards",
                "entryId": "1668-6989-2470-5e10",
                "number": 1,
                "type": "upgrade",
                "from": "entry"
              },
              {
                "categories": [
                  {
                    "id": "ac97-b27c-7e35-7ab9",
                    "entryId": "ac97-b27c-7e35-7ab9",
                    "name": "Army Composition",
                    "primary": true
                  }
                ],
                "id": "4aaal3l",
                "name": "Manifestation Lore",
                "entryId": "24b9-572f-300a-f410",
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
                        ],
                        "id": "4fldpi",
                        "name": "Overwhelming Acquiescence",
                        "entryId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::3627-4b2a-6812-1b25",
                        "entryGroupId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::a740-8833-9146-5ead",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Lore of Extravagance"
                      },
                      {
                        "profiles": [
                        ],
                        "id": "4ffq1qp",
                        "name": "Phantasmagoria",
                        "entryId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::7b9c-7233-85fc-0390",
                        "entryGroupId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::a740-8833-9146-5ead",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Lore of Extravagance"
                      },
                      {
                        "profiles": [
                        ],
                        "id": "4e5qj4",
                        "name": "Sadistic Spite",
                        "entryId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::c41d-7a19-bc94-e48b",
                        "entryGroupId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::a740-8833-9146-5ead",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Lore of Extravagance"
                      }
                    ],
                    "id": "4dlkzmq",
                    "name": "Lore of Extravagance",
                    "entryId": "938e-c4bb-ca41-33e9::c085-6e5e-a0ce-fb46",
                    "entryGroupId": "938e-c4bb-ca41-33e9::a0dd-82b8-8dcd-c15a",
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
                "id": "4dqlxxt",
                "name": "Spell Lore",
                "entryId": "24b6-2275-f051-2a24",
                "number": 1,
                "type": "upgrade",
                "from": "entry"
              },
              {
                "rules": [
                  {
                    "description": "The following universal terrain abilities apply to this terrain feature (Terrain, 1.2):\nCover, Impassable",
                    "id": "f39f-bd91-532b-999",
                    "name": "Fane of Slaanesh",
                    "hidden": false
                  }
                ],
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "Your Hero Phase",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "Pick a friendly Hedonites of Slaanesh unit wholly within 12\" of this terrain feature to be the target.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Allocate D3 damage points to the target (ward rolls cannot be made for those damage points). Then, pick 1 of the following effects to apply until the start of your next turn:\n• Add 1 to wound rolls for the target's combat attacks.\n• Add 1 to run rolls and charge rolls for the target.\n• Add 1 to casting rolls and unbinding rolls for the target.",
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
                    "id": "c0aa-df5e-6df8-f65d",
                    "name": "Damned Conduit",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
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
                        "$text": "10",
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
                    "id": "6f47-50f1-1e37-8e67",
                    "name": "Fane of Slaanesh",
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
                        "$text": "In step 1 of the damage sequence (see 18.0), make a ward roll of D6 for each damage point in this unit's damage pool. If the roll equals or exceeds this unit's ward value, remove that damage point from the damage pool.",
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
                    "id": "cdd6-ffa1-9b32-4cb8",
                    "entryId": "cdd6-ffa1-9b32-4cb8",
                    "name": "FACTION TERRAIN",
                    "primary": true
                  },
                  {
                    "id": "70a4-383f-421f-52cd",
                    "name": "WARD (6+)",
                    "entryId": "70a4-383f-421f-52cd",
                    "primary": false
                  },
                  {
                    "id": "319b-38ee-d10d-e800",
                    "name": "CHAOS",
                    "entryId": "319b-38ee-d10d-e800",
                    "primary": false
                  },
                  {
                    "id": "67df-cdfb-d83f-3197",
                    "name": "HEDONITES OF SLAANESH",
                    "entryId": "67df-cdfb-d83f-3197",
                    "primary": false
                  }
                ],
                "id": "4fjlukt",
                "name": "Fane of Slaanesh",
                "entryId": "a080-ae8d-69c-3193::bad2-41cf-b054-d9b3",
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
                "name": "Uncategorized",
                "id": "n0x0xig",
                "primary": false,
                "entryId": "(No Category)"
              },
              {
                "name": "Configuration",
                "id": "n0bxqgl",
                "primary": false,
                "entryId": "676-2b78-7bbf-ba9c"
              },
              {
                "name": "Reference",
                "id": "iemlb3nr",
                "primary": false,
                "entryId": "3360-1158-e879-9606"
              },
              {
                "name": "Army Composition",
                "id": "3iwrp16",
                "primary": false,
                "entryId": "ac97-b27c-7e35-7ab9"
              },
              {
                "name": "FACTION TERRAIN",
                "id": "3ir75ms",
                "primary": false,
                "entryId": "cdd6-ffa1-9b32-4cb8"
              },
              {
                "name": "Illegal Units",
                "id": "n11gac",
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
                        ],
                        "id": "2356-acea-ac09-3a24",
                        "name": "Glutos Orscollion, Lord of Gluttony",
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
                            "$text": "Pick a friendly Sybarite unit wholly within 12\" of this unit to be the target.",
                            "name": "Declare",
                            "typeId": "bad3-f9c5-ba46-18cb"
                          },
                          {
                            "$text": "Heal (6) the target.",
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
                            "$text": "Defensive",
                            "name": "Type",
                            "typeId": "6d16-c86b-2698-85a4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "2d74-4dcd-8468-87fa"
                          }
                        ],
                        "id": "437b-af31-be16-73ff",
                        "name": "Gorge on Excess",
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
                            "$text": "A different effect applies to friendly **Sybarite** units each battle round while they are wholly within 12\" of this unit, as shown below. The effects of all previous battle rounds also apply to those units while they are wholly within 12\" of this unit.\n**Battle Round 1:**\n*Starter:* Add 1 to run rolls and charge rolls for those units.\n**Battle Round 2:**\n*Main:* Add 3 to those units' control scores.\n**Battle Round 3:**\n*Dessert:* Add 1 to hit rolls for those unit's attacks.\n**Battle Round 4+:**\n*Digestif:* Add 1 to the Rend characteristic of those units' melee weapons.",
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
                        "id": "67e3-1d88-9bb4-4906",
                        "name": "The Grand Gourmand",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "$text": "4",
                            "name": "Casting Value",
                            "typeId": "test-cv"
                          }
                        ],
                        "attributes": [
                        ],
                        "id": "test-easy-spell",
                        "name": "Easy Spell",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "$text": "6",
                            "name": "Casting Value",
                            "typeId": "test-cv"
                          }
                        ],
                        "attributes": [
                        ],
                        "id": "test-medium-spell",
                        "name": "Medium Spell",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "$text": "9",
                            "name": "Casting Value",
                            "typeId": "test-cv"
                          }
                        ],
                        "attributes": [
                        ],
                        "id": "test-hard-spell",
                        "name": "Hard Spell",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                        ],
                        "attributes": [
                        ],
                        "id": "28b9-9c9b-3e06-d093",
                        "name": "Crippling Famishment",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                        ],
                        "attributes": [
                        ],
                        "id": "8dce-246a-9a52-2f1f",
                        "name": "Battle Damaged",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                        ],
                        "attributes": [
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
                        "id": "plmlooh",
                        "name": "General",
                        "entryId": "e6cc-9cda-6e08-4921::2f3d-7d70-c960-8fd4::a56b-952e-ad15-7868",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "selections": [
                        ],
                        "id": "plspqv",
                        "name": "Glutos Orscollion, Lord of Gluttony",
                        "entryId": "e6cc-9cda-6e08-4921::eb67-8aa-9f1b-f683",
                        "number": 1,
                        "type": "model",
                        "from": "entry"
                      }
                    ],
                    "costs": [
                      {
                        "name": "pts",
                        "typeId": "points",
                        "value": 440
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
                        "id": "72ce-2188-70bf-2dbd",
                        "name": "UNIQUE",
                        "entryId": "72ce-2188-70bf-2dbd",
                        "primary": false
                      },
                      {
                        "id": "c203-51a0-3d44-6b07",
                        "name": "WARMASTER",
                        "entryId": "c203-51a0-3d44-6b07",
                        "primary": false
                      },
                      {
                        "id": "319b-38ee-d10d-e800",
                        "name": "CHAOS",
                        "entryId": "319b-38ee-d10d-e800",
                        "primary": false
                      },
                      {
                        "id": "52cc-95fd-6cd3-8f72",
                        "name": "WARD (5+)",
                        "entryId": "52cc-95fd-6cd3-8f72",
                        "primary": false
                      },
                      {
                        "id": "67df-cdfb-d83f-3197",
                        "name": "HEDONITES OF SLAANESH",
                        "entryId": "67df-cdfb-d83f-3197",
                        "primary": false
                      },
                      {
                        "id": "f7bc-b618-4b5d-2bae",
                        "name": "WAR MACHINE",
                        "entryId": "f7bc-b618-4b5d-2bae",
                        "primary": false
                      },
                      {
                        "id": "8179-697a-9f4c-91d4",
                        "name": "WIZARD (2)",
                        "entryId": "8179-697a-9f4c-91d4",
                        "primary": false
                      },
                      {
                        "id": "test-priest-1",
                        "name": "PRIEST (1)",
                        "entryId": "test-priest-1",
                        "primary": false
                      },
                      {
                        "id": "9a4b-cd0b-84e1-16c5",
                        "name": "SYBARITE",
                        "entryId": "9a4b-cd0b-84e1-16c5",
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
                    "id": "pjm38v5",
                    "name": "Glutos Orscollion, Lord of Gluttony",
                    "entryId": "e6cc-9cda-6e08-4921::fac2-b0a0-feec-f70f",
                    "number": 1,
                    "type": "unit",
                    "from": "entry"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                        ],
                        "id": "839-fd59-615-613",
                        "name": "Blissbarb Archers",
                        "hidden": false,
                        "typeId": "ff03-376e-972f-8ab2",
                        "typeName": "Unit",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "$text": "This unit's **Blissbrew Homonculus** is a token. Subtract 1 from hit rolls for shooting attacks that target this unit while it has a **Blissbrew Homonculus**.",
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
                          }
                        ],
                        "id": "4e44-7769-baad-8488",
                        "name": "Blissbrew Homonculus",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      }
                    ],
                    "selections": [
                      {
                        "selections": [
                        ],
                        "id": "gdfvtw7",
                        "name": "Blissbarb Archer",
                        "entryId": "9d84-476c-99d7-bc26::35d-6c68-da98-8373",
                        "number": 19,
                        "type": "model",
                        "from": "entry"
                      },
                      {
                        "selections": [
                        ],
                        "id": "htb292k",
                        "name": "Blissbarb Archer",
                        "entryId": "9d84-476c-99d7-bc26::35d-6c68-da98-8373",
                        "number": 1,
                        "type": "model",
                        "from": "entry"
                      },
                      {
                        "id": "g96u9p",
                        "name": "Reinforced",
                        "entryId": "4e6-33d6-5d6d-9a4f::1b37-82b8-c062-eb82",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "costs": [
                      {
                        "name": "pts",
                        "typeId": "points",
                        "value": 300
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
                        "id": "319b-38ee-d10d-e800",
                        "name": "CHAOS",
                        "entryId": "319b-38ee-d10d-e800",
                        "primary": false
                      },
                      {
                        "id": "67df-cdfb-d83f-3197",
                        "name": "HEDONITES OF SLAANESH",
                        "entryId": "67df-cdfb-d83f-3197",
                        "primary": false
                      },
                      {
                        "id": "9a4b-cd0b-84e1-16c5",
                        "name": "SYBARITE",
                        "entryId": "9a4b-cd0b-84e1-16c5",
                        "primary": false
                      },
                      {
                        "id": "db3a-7199-c92e-f3cf",
                        "name": "Regimental Option",
                        "entryId": "db3a-7199-c92e-f3cf",
                        "primary": false
                      }
                    ],
                    "id": "g3wxfsm",
                    "name": "Blissbarb Archers",
                    "entryId": "9d84-476c-99d7-bc26::7516-fef5-83f7-22a7",
                    "number": 1,
                    "type": "unit",
                    "from": "entry"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                        ],
                        "id": "7ead-f7db-fb3d-fcf",
                        "name": "Myrmidesh Painbringers",
                        "hidden": false,
                        "typeId": "ff03-376e-972f-8ab2",
                        "typeName": "Unit",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                          {
                            "$text": "Add 1 to the **Attacks** characteristic of this unit's melee weapons while it is in combat with an enemy unit that has more models than it.",
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
                          }
                        ],
                        "id": "b838-7d26-f8e-4459",
                        "name": "Paragons of Battle",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      }
                    ],
                    "selections": [
                      {
                        "selections": [
                        ],
                        "id": "25kome",
                        "name": "Myrmidesh Painbringer",
                        "entryId": "481f-346e-e960-c6d7::1c07-7a37-4c77-cc86",
                        "number": 1,
                        "type": "model",
                        "from": "entry"
                      },
                      {
                        "selections": [
                        ],
                        "id": "2538fz",
                        "name": "Myrmidesh Painbringer",
                        "entryId": "481f-346e-e960-c6d7::1c07-7a37-4c77-cc86",
                        "number": 4,
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
                        "id": "67df-cdfb-d83f-3197",
                        "name": "HEDONITES OF SLAANESH",
                        "entryId": "67df-cdfb-d83f-3197",
                        "primary": false
                      },
                      {
                        "id": "319b-38ee-d10d-e800",
                        "name": "CHAOS",
                        "entryId": "319b-38ee-d10d-e800",
                        "primary": false
                      },
                      {
                        "id": "f679-3bcb-d664-9ac3",
                        "name": "CHAMPION",
                        "entryId": "f679-3bcb-d664-9ac3",
                        "primary": false
                      },
                      {
                        "id": "75d6-6995-dfcc-3898",
                        "entryId": "75d6-6995-dfcc-3898",
                        "name": "INFANTRY",
                        "primary": true
                      },
                      {
                        "id": "9a4b-cd0b-84e1-16c5",
                        "name": "SYBARITE",
                        "entryId": "9a4b-cd0b-84e1-16c5",
                        "primary": false
                      },
                      {
                        "id": "db3a-7199-c92e-f3cf",
                        "name": "Regimental Option",
                        "entryId": "db3a-7199-c92e-f3cf",
                        "primary": false
                      }
                    ],
                    "id": "23odp7p",
                    "name": "Myrmidesh Painbringers",
                    "entryId": "481f-346e-e960-c6d7::af06-7271-8760-4a4",
                    "number": 1,
                    "type": "unit",
                    "from": "entry"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                        ],
                        "id": "23a2-7e2c-360-47a4",
                        "name": "Symbaresh Twinsouls",
                        "hidden": false,
                        "typeId": "ff03-376e-972f-8ab2",
                        "typeName": "Unit",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                        ],
                        "attributes": [
                        ],
                        "id": "b175-ab7b-fea9-d0b3",
                        "name": "Fiendish Reflexes",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                        ],
                        "attributes": [
                        ],
                        "id": "59d5-6aa3-aa0f-1366",
                        "name": "Ego-driven Excess",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      }
                    ],
                    "selections": [
                      {
                        "id": "h7lwp8h",
                        "name": "Reinforced",
                        "entryId": "2194-8387-d7fd-831b::1b37-82b8-c062-eb82",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "selections": [
                        ],
                        "id": "h7fvanj",
                        "name": "Symbaresh Twinsoul",
                        "entryId": "f468-4cd6-3439-6f96::e8ee-16e8-e1dd-2233",
                        "number": 1,
                        "type": "model",
                        "from": "entry"
                      },
                      {
                        "selections": [
                        ],
                        "id": "h8xcrgm",
                        "name": "Symbaresh Twinsoul",
                        "entryId": "f468-4cd6-3439-6f96::e8ee-16e8-e1dd-2233",
                        "number": 10,
                        "type": "model",
                        "from": "entry"
                      }
                    ],
                    "costs": [
                      {
                        "name": "pts",
                        "typeId": "points",
                        "value": 260
                      }
                    ],
                    "categories": [
                      {
                        "id": "67df-cdfb-d83f-3197",
                        "name": "HEDONITES OF SLAANESH",
                        "entryId": "67df-cdfb-d83f-3197",
                        "primary": false
                      },
                      {
                        "id": "319b-38ee-d10d-e800",
                        "name": "CHAOS",
                        "entryId": "319b-38ee-d10d-e800",
                        "primary": false
                      },
                      {
                        "id": "f679-3bcb-d664-9ac3",
                        "name": "CHAMPION",
                        "entryId": "f679-3bcb-d664-9ac3",
                        "primary": false
                      },
                      {
                        "id": "75d6-6995-dfcc-3898",
                        "entryId": "75d6-6995-dfcc-3898",
                        "name": "INFANTRY",
                        "primary": true
                      },
                      {
                        "id": "9a4b-cd0b-84e1-16c5",
                        "name": "SYBARITE",
                        "entryId": "9a4b-cd0b-84e1-16c5",
                        "primary": false
                      },
                      {
                        "id": "db3a-7199-c92e-f3cf",
                        "name": "Regimental Option",
                        "entryId": "db3a-7199-c92e-f3cf",
                        "primary": false
                      }
                    ],
                    "id": "h6wk8ni",
                    "name": "Symbaresh Twinsouls",
                    "entryId": "f468-4cd6-3439-6f96::ffcf-47e1-a14f-b507",
                    "number": 1,
                    "type": "unit",
                    "from": "entry"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                        ],
                        "id": "23a2-7e2c-360-47a4",
                        "name": "Symbaresh Twinsouls",
                        "hidden": false,
                        "typeId": "ff03-376e-972f-8ab2",
                        "typeName": "Unit",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                        ],
                        "attributes": [
                        ],
                        "id": "b175-ab7b-fea9-d0b3",
                        "name": "Fiendish Reflexes",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      },
                      {
                        "characteristics": [
                        ],
                        "attributes": [
                        ],
                        "id": "59d5-6aa3-aa0f-1366",
                        "name": "Ego-driven Excess",
                        "hidden": false,
                        "typeId": "907f-a48-6a04-f788",
                        "typeName": "Ability (Passive)",
                        "from": "entry"
                      }
                    ],
                    "selections": [
                      {
                        "selections": [
                        ],
                        "id": "3qlt56",
                        "name": "Symbaresh Twinsoul",
                        "entryId": "f468-4cd6-3439-6f96::e8ee-16e8-e1dd-2233",
                        "number": 1,
                        "type": "model",
                        "from": "entry"
                      },
                      {
                        "selections": [
                        ],
                        "id": "3s5v0z",
                        "name": "Symbaresh Twinsoul",
                        "entryId": "f468-4cd6-3439-6f96::e8ee-16e8-e1dd-2233",
                        "number": 4,
                        "type": "model",
                        "from": "entry"
                      }
                    ],
                    "costs": [
                      {
                        "name": "pts",
                        "typeId": "points",
                        "value": 130
                      }
                    ],
                    "categories": [
                      {
                        "id": "67df-cdfb-d83f-3197",
                        "name": "HEDONITES OF SLAANESH",
                        "entryId": "67df-cdfb-d83f-3197",
                        "primary": false
                      },
                      {
                        "id": "319b-38ee-d10d-e800",
                        "name": "CHAOS",
                        "entryId": "319b-38ee-d10d-e800",
                        "primary": false
                      },
                      {
                        "id": "f679-3bcb-d664-9ac3",
                        "name": "CHAMPION",
                        "entryId": "f679-3bcb-d664-9ac3",
                        "primary": false
                      },
                      {
                        "id": "75d6-6995-dfcc-3898",
                        "entryId": "75d6-6995-dfcc-3898",
                        "name": "INFANTRY",
                        "primary": true
                      },
                      {
                        "id": "9a4b-cd0b-84e1-16c5",
                        "name": "SYBARITE",
                        "entryId": "9a4b-cd0b-84e1-16c5",
                        "primary": false
                      },
                      {
                        "id": "db3a-7199-c92e-f3cf",
                        "name": "Regimental Option",
                        "entryId": "db3a-7199-c92e-f3cf",
                        "primary": false
                      }
                    ],
                    "id": "3jd4s1e",
                    "name": "Symbaresh Twinsouls",
                    "entryId": "f468-4cd6-3439-6f96::ffcf-47e1-a14f-b507",
                    "number": 1,
                    "type": "unit",
                    "from": "entry"
                  }
                ],
                "categories": [
                  {
                    "name": "Uncategorized",
                    "id": "oa00uwq",
                    "primary": false,
                    "entryId": "(No Category)"
                  },
                  {
                    "name": "Regimental Leader",
                    "id": "76mnup",
                    "primary": false,
                    "entryId": "d1f3-921c-b403-1106"
                  },
                  {
                    "name": "HERO",
                    "id": "ob7fqab",
                    "primary": false,
                    "entryId": "6e72-1656-d554-528a"
                  },
                  {
                    "name": "INFANTRY",
                    "id": "76bzekp",
                    "primary": false,
                    "entryId": "75d6-6995-dfcc-3898"
                  },
                  {
                    "name": "MONSTER",
                    "id": "obsdabx",
                    "primary": false,
                    "entryId": "6d54-625c-d063-13e2"
                  },
                  {
                    "name": "WAR MACHINE",
                    "id": "obixys",
                    "primary": false,
                    "entryId": "f7bc-b618-4b5d-2bae"
                  },
                  {
                    "name": "CAVALRY",
                    "id": "obd82k",
                    "primary": false,
                    "entryId": "926c-df8c-6841-d49e"
                  },
                  {
                    "name": "BEAST",
                    "id": "ob5nqd",
                    "primary": false,
                    "entryId": "b224-8c8e-ca93-9860"
                  },
                  {
                    "name": "Illegal Units",
                    "id": "obq3f2c",
                    "primary": false,
                    "entryId": "(Illegal Units)"
                  }
                ],
                "id": "75isoig",
                "name": "Regiment",
                "entryId": "48a1-e075-c797-5605::376a-6b97-8699-dd59",
                "catalogueId": "afdb-68a1-283e-3bf2",
                "catalogueRevision": 28,
                "catalogueName": "Hedonites of Slaanesh"
              },
              {
                "selections": [
                  {
                    "profiles": [
                      {
                        "characteristics": [
                        ],
                        "id": "q1jruw2",
                        "name": "Lord of Hubris",
                        "hidden": false,
                        "typeId": "ff03-376e-972f-8ab2",
                        "typeName": "Unit",
                        "from": "entry"
                      }
                    ],
                    "selections": [
                      {
                        "id": "q1jruw2",
                        "name": "Lord of Hubris",
                        "entryId": "e120-58a7-b8ef-ab66::ef1b-a791-66b4-735f",
                        "number": 1,
                        "type": "unit",
                        "from": "entry"
                      }
                    ],
                    "costs": [
                      {
                        "name": "pts",
                        "typeId": "points",
                        "value": 0
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
                        "id": "319b-38ee-d10d-e800",
                        "name": "CHAOS",
                        "entryId": "319b-38ee-d10d-e800",
                        "primary": false
                      },
                      {
                        "id": "67df-cdfb-d83f-3197",
                        "name": "HEDONITES OF SLAANESH",
                        "entryId": "67df-cdfb-d83f-3197",
                        "primary": false
                      },
                      {
                        "id": "8179-697a-9f4c-91d4",
                        "name": "WIZARD (2)",
                        "entryId": "8179-697a-9f4c-91d4",
                        "primary": false
                      },
                      {
                        "id": "9a4b-cd0b-84e1-16c5",
                        "name": "SYBARITE",
                        "entryId": "9a4b-cd0b-84e1-16c5",
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
                    "id": "q1jruw2",
                    "name": "Lord of Hubris",
                    "entryId": "e120-58a7-b8ef-ab66::ef1b-a791-66b4-735f",
                    "number": 1,
                    "type": "unit",
                    "from": "entry"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                        ],
                        "id": "pm3jy8n",
                        "name": "Slaangor Fiendbloods (Scourge of Ghyran)",
                        "hidden": false,
                        "typeId": "ff03-376e-972f-8ab2",
                        "typeName": "Unit",
                        "from": "entry"
                      }
                    ],
                    "selections": [
                      {
                        "id": "pm3jy8n",
                        "name": "Slaangor Fiendbloods (Scourge of Ghyran)",
                        "entryId": "0b5c-79f3-7a55-970a::3e9a-0e86-a7fa-ec3d",
                        "number": 1,
                        "type": "unit",
                        "from": "entry"
                      }
                    ],
                    "costs": [
                      {
                        "name": "pts",
                        "typeId": "points",
                        "value": 0
                      }
                    ],
                    "categories": [
                      {
                        "id": "67df-cdfb-d83f-3197",
                        "name": "HEDONITES OF SLAANESH",
                        "entryId": "67df-cdfb-d83f-3197",
                        "primary": false
                      },
                      {
                        "id": "319b-38ee-d10d-e800",
                        "name": "CHAOS",
                        "entryId": "319b-38ee-d10d-e800",
                        "primary": false
                      },
                      {
                        "id": "f679-3bcb-d664-9ac3",
                        "name": "CHAMPION",
                        "entryId": "f679-3bcb-d664-9ac3",
                        "primary": false
                      },
                      {
                        "id": "75d6-6995-dfcc-3898",
                        "entryId": "75d6-6995-dfcc-3898",
                        "name": "INFANTRY",
                        "primary": true
                      },
                      {
                        "id": "9a4b-cd0b-84e1-16c5",
                        "name": "SYBARITE",
                        "entryId": "9a4b-cd0b-84e1-16c5",
                        "primary": false
                      },
                      {
                        "id": "db3a-7199-c92e-f3cf",
                        "name": "Regimental Option",
                        "entryId": "db3a-7199-c92e-f3cf",
                        "primary": false
                      }
                    ],
                    "id": "pm3jy8n",
                    "name": "Slaangor Fiendbloods (Scourge of Ghyran)",
                    "entryId": "0b5c-79f3-7a55-970a::3e9a-0e86-a7fa-ec3d",
                    "number": 1,
                    "type": "unit",
                    "from": "entry"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                        ],
                        "id": "d1ikszt7",
                        "name": "Slickblade Seekers",
                        "hidden": false,
                        "typeId": "ff03-376e-972f-8ab2",
                        "typeName": "Unit",
                        "from": "entry"
                      }
                    ],
                    "selections": [
                      {
                        "id": "d1ikszt7",
                        "name": "Slickblade Seekers",
                        "entryId": "abb6-eea9-4ae3-cbd5::395d-b625-25a4-4ca2",
                        "number": 1,
                        "type": "unit",
                        "from": "entry"
                      }
                    ],
                    "costs": [
                      {
                        "name": "pts",
                        "typeId": "points",
                        "value": 0
                      }
                    ],
                    "categories": [
                      {
                        "id": "67df-cdfb-d83f-3197",
                        "name": "HEDONITES OF SLAANESH",
                        "entryId": "67df-cdfb-d83f-3197",
                        "primary": false
                      },
                      {
                        "id": "319b-38ee-d10d-e800",
                        "name": "CHAOS",
                        "entryId": "319b-38ee-d10d-e800",
                        "primary": false
                      },
                      {
                        "id": "f679-3bcb-d664-9ac3",
                        "name": "CHAMPION",
                        "entryId": "f679-3bcb-d664-9ac3",
                        "primary": false
                      },
                      {
                        "id": "75d6-6995-dfcc-3898",
                        "entryId": "75d6-6995-dfcc-3898",
                        "name": "INFANTRY",
                        "primary": true
                      },
                      {
                        "id": "9a4b-cd0b-84e1-16c5",
                        "name": "SYBARITE",
                        "entryId": "9a4b-cd0b-84e1-16c5",
                        "primary": false
                      },
                      {
                        "id": "db3a-7199-c92e-f3cf",
                        "name": "Regimental Option",
                        "entryId": "db3a-7199-c92e-f3cf",
                        "primary": false
                      }
                    ],
                    "id": "d1ikszt7",
                    "name": "Slickblade Seekers",
                    "entryId": "abb6-eea9-4ae3-cbd5::395d-b625-25a4-4ca2",
                    "number": 1,
                    "type": "unit",
                    "from": "entry"
                  }
                ],
                "categories": [
                  {
                    "name": "Uncategorized",
                    "id": "p9iwpdq",
                    "primary": false,
                    "entryId": "(No Category)"
                  },
                  {
                    "name": "Regimental Leader",
                    "id": "qrgdxsb",
                    "primary": false,
                    "entryId": "d1f3-921c-b403-1106"
                  },
                  {
                    "name": "HERO",
                    "id": "pad1dv",
                    "primary": false,
                    "entryId": "6e72-1656-d554-528a"
                  },
                  {
                    "name": "INFANTRY",
                    "id": "qs56loq",
                    "primary": false,
                    "entryId": "75d6-6995-dfcc-3898"
                  },
                  {
                    "name": "MONSTER",
                    "id": "pan995",
                    "primary": false,
                    "entryId": "6d54-625c-d063-13e2"
                  },
                  {
                    "name": "WAR MACHINE",
                    "id": "pal9zv",
                    "primary": false,
                    "entryId": "f7bc-b618-4b5d-2bae"
                  },
                  {
                    "name": "CAVALRY",
                    "id": "qsjnako",
                    "primary": false,
                    "entryId": "926c-df8c-6841-d49e"
                  },
                  {
                    "name": "BEAST",
                    "id": "pa83hs",
                    "primary": false,
                    "entryId": "b224-8c8e-ca93-9860"
                  },
                  {
                    "name": "Illegal Units",
                    "id": "pa735dd",
                    "primary": false,
                    "entryId": "(Illegal Units)"
                  }
                ],
                "id": "qq9w69n",
                "name": "Regiment",
                "entryId": "48a1-e075-c797-5605::376a-6b97-8699-dd59",
                "catalogueId": "afdb-68a1-283e-3bf2",
                "catalogueRevision": 28,
                "catalogueName": "Hedonites of Slaanesh"
              }
            ],
            "id": "3cqzu7",
            "name": "✦ General's Handbook 2025-26",
            "entryId": "f079-501a-2738-6845",
            "catalogueId": "afdb-68a1-283e-3bf2",
            "catalogueRevision": 28,
            "catalogueName": "Hedonites of Slaanesh"
          }
        ],
        "id": "30w579p",
        "name": "Fun fun tummy",
        "battleScribeVersion": 2.03,
        "generatedBy": "https://newrecruit.eu",
        "gameSystemId": "e51d-b1a3-75fc-dc3g",
        "gameSystemName": "Age of Sigmar 4.0",
        "xmlns": "http://www.battlescribe.net/schema/rosterSchema"
      }
  };

export default exampleRoster;
