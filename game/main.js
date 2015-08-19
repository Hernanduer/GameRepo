var main = {
	spawnName: "",
	spawn: {},
	droneAttrs: {
		//4 4 4 = 800
		"h": [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
		//3 7 5 = 900
		"f": [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
		//4 6 5 = 950
		"b": [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
		//8 7 3 = 1150
		"c": [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
		//8 4 = 600
		"l": [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
		//8 10 9 = 1190
		"m": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL],
		"t": [ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
		//5 1 10 8 = 1450
		//"r": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL]
		"r": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL]
		//"r": [MOVE]
	},
	droneAttrs2: {
		//4 6 5 = 950
		"h": [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
		//3 7 5 = 900
		"f": [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
		//4 6 5 = 950
		"b": [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
		//5 5 5 = 1000
		"c": [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
		//6 3 = 450
		"l": [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
		//8 8 16 = 1520
		//"m": [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
		"t": [ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
		//"r": [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
		"r": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL]
		//"r": [MOVE]
	},
	droneCost: function(attrList) {
		var sum = 0;
		for (var i = 0; i < attrList.length; ++i) {
			switch(attrList[i]) {
			case TOUGH:
				sum += 10;
				break;
			case MOVE:
			case CARRY:
				sum += 50;
				break;
			case ATTACK:
				sum += 80;
				break;
			case WORK:
				sum += 100;
				break;
			case RANGED_ATTACK:
				sum += 150;
				break;
			case HEAL:
				sum += 250;
				break;
			}
		}
		return sum;
	},
	newDrone: function(dtype) {
		if (this.spawn.spawning) {
			//console.log("Spawner already busy building");
			return 1;
		}
		this.spawn.room.memory.timer = 0;
		this.roomMaintenance();
		var droneNum = this.spawn.memory.lastDrone + 1;
		var droneName = this.spawn.memory.prefix + "Unit " + droneNum;
		var droneMem = {"task": null, "role": "", "parent": this.spawn.id, "internalTask": null, "target": null, "dropoff": this.spawn.id, "lastPos": [0, 0]};
		
		var dt = this.droneAttrs;
		if (this.spawn.memory.attrType == 2)
			dt = this.droneAttrs2;
		
		switch (dtype) {
			case "h":
				droneMem["role"] = "harvester";
			break;
			case "f":
				droneMem["role"] = "farHarvester";
			break;
			case "b":
				droneMem["role"] = "builder";
			break;
			case "c":
				droneMem["role"] = "controllerKeeper";
			break;
			case "l":
				droneMem["role"] = "librarian";
			break;
			case "m":
				droneMem["role"] = "melee";
			break;
			case "t":
				droneMem["role"] = "tank";
			break;
			case "r":
				droneMem["role"] = "ranged";
			break;
			default:
				console.log("Undefined drone type " + dtype);
			return;
		}
		
		
		var cost = this.droneCost(dt[dtype]);
		if (cost > this.spawn.room.memory.energyMax) {
			console.log("Energy capacity (" + this.spawn.room.memory.energyMax + "/" + cost + ") not large enough for spawner " + this.spawn.name);
			return 1;
		} else if (cost > this.spawn.room.memory.energy) {
			console.log("Not enough energy (" + this.spawn.room.memory.energy + "/" + cost + ") in the spawner " + this.spawn.name);
			return 1;
		}
		if (this.spawn.memory.totalDrones[dtype])
			this.spawn.memory.totalDrones[dtype] += 1;
		else
			this.spawn.memory.totalDrones[dtype] = 1;
		this.spawn.memory.freeDrones[droneName] = droneMem["role"];
		this.spawn.createCreep(dt[dtype], droneName, droneMem);
		this.spawn.memory.lastDrone += 1;
		this.spawn.memory.droneCount += 1;
		console.log("Building " + droneName + " (" + droneMem["role"] + ") with cost " + cost);
		return 0;
	},
	getWorkSite: function(creep) {
		var csite = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
		var site = undefined;
		if (creep.room.memory.builtWalls != undefined) {
			for (var s in creep.room.memory.builtWalls) {
				site = Game.getObjectById(s);
				if (site != undefined && (site.hits / site.hitsMax < creep.room.memory.buildWallsPercent || (site.hits / site.hitsMax < 1 && site.hits < creep.room.memory.buildWallsTo)) && creep.room.memory.builtWalls[s] > 0) {
					creep.room.memory.builtWalls[s] -= 1;
					break;
				}
				site = undefined;
			}
		}
		if (creep.room.memory.constructedWalls != undefined && site == undefined) {
			for (var s in creep.room.memory.constructedWalls) {
				site = Game.getObjectById(s);
				if (site != undefined && site.hits / site.hitsMax < creep.room.memory.constructedWallsPercent && creep.room.memory.constructedWalls[s] > 0) {
					creep.room.memory.constructedWalls[s] -= 1;
					break;
				}
				site = undefined;
			}
		}
		if (site != undefined && csite != undefined) {
			if (creep.pos.getRangeTo(csite) < creep.pos.getRangeTo(site) + 10)
				site = csite;
		} else {
			site = (csite != undefined) ? csite : site;
		}
		return site;
	},
	creepGoTo: function(creep, dest, isLibrarian) {
		isLibrarian = isLibrarian != undefined ? isLibrarian : false;

		var xyMove = false;

		/*if (Game.rooms[creep.memory.target] != undefined) {
			var pathName = creep.room.name + "-" + creep.memory.target + " Path";
			if (creep.memory.sourceTarget != null) {
				if (creep.room.name != creep.memory.target && creep.memory.internalTask < 2) //I really don't lke having internalTask here in such a generic function but idk how else to do it
					pathName = creep.room.name + "-" + creep.memory.sourceTarget + " Path";
				else
					pathName = creep.memory.sourceTarget + "-" + creep.memory.dropoff + " Path";
			} else if (creep.room.name == creep.memory.target) {
				pathName = creep.room.name + "-" + creep.memory.dropoff + " Path";
			}

			var prePath = Memory.paths[pathName];
			if (prePath != undefined && creep.memory.lastPath != pathName && creep.pos.getRangeTo(prePath[0][0], prePath[0][1]) < creep.pos.getRangeTo(creep.memory.dest[0], creep.memory.dest[1])) {
				if (creep.memory.pathProgress == undefined) {
					creep.memory.dest = prePath[0];
					xyMove = true;
					creep.memory.pathProgress = 0;
					return true;
				} else if (creep.memory.pathProgress < (prePath.length - 1)) {
					if (creep.pos.getRangeTo(creep.memory.dest[0], creep.memory.dest[1]) < 2) {
						creep.memory.pathProgress += 2;
						if (creep.memory.pathProgress >= prePath.length) creep.memory.pathProgress = prePath.length - 1;
						var pg = creep.memory.pathProgress;
						creep.memory.dest = prePath[pg];
						xyMove = true;
					}
					return true;
				} else {
					creep.memory.repathTimer = 0;
					delete creep.memory.pathProgress;
					creep.memory.lastPath = pathName;
				}
			}
		}*/

		var d2 = dest;

		if (creep.room.memory.stuckCreeps != undefined) {
			var val = creep.room.memory.stuckCreeps[creep.id];
			if ((val == undefined || val >= 0) && creep.fatigue == 0 && creep.memory.lastPos != undefined && creep.memory.lastPos[0] == creep.pos.x && creep.memory.lastPos[1] == creep.pos.y) {
				if (val == undefined)
					creep.room.memory.stuckCreeps[creep.id] = 1;
				else
					creep.room.memory.stuckCreeps[creep.id] += 1;
			} else if (val == 0) {
				delete creep.room.memory.stuckCreeps[creep.id];
			} else if (val > 0) {
				creep.room.memory.stuckCreeps[creep.id] -= 1;
			}
			val = creep.room.memory.stuckCreeps[creep.id];
			if (val > 5) {
				var flagName = creep.room.memory.blockFlag;
				console.log(creep.name + " is blocked and is returning to " + flagName);
				d2 = Game.flags[flagName];
				xyMove = false;
				creep.room.memory.stuckCreeps[creep.id] = -val;
				delete creep.memory.pathProgress;
				if (isLibrarian) {
					this.freeExtension(creep);
					creep.memory.internalTask = null;
					creep.memory.dropoff = null;
				}
			} else if (val < 0) {
				var flagName = creep.room.memory.blockFlag;
				d2 = Game.flags[flagName];
				xyMove = false;
				creep.room.memory.stuckCreeps[creep.id] += 1;
			}
		}

		/*creep.memory.lastPos = [creep.pos.x, creep.pos.y];
		for (var i in creep.room.memory.impassableFlags) {
			if (creep.pos.getRangeTo(Game.getObjectById(i)) < creep.room.memory.impassableFlags[i])
		}*/
		if (xyMove == false)
			creep.moveTo(d2);
		else
			creep.moveTo(creep.memory.dest[0], creep.memory.dest[1]);
	},
	goAfar: function(creep, roomName) {
		if (creep.memory.dest == undefined || creep.memory.repathTimer == undefined || creep.memory.repathTimer <= 0) {
			var dest = creep.pos.findClosest(creep.room.findExitTo(roomName));
			creep.memory.repathTimer = 8;
			if (dest == undefined) return false;
			else creep.memory.dest = [dest.x, dest.y];
		}
		creep.memory.repathTimer -= 1;
		return true;
	},
	freeExtension: function(creep) {
		var o = Game.getObjectById(creep.memory.dropoff);
		if (o != null && o.structureType == "extension") {
			this.spawn.room.memory.extensions[creep.memory.dropoff] += 1;
			creep.memory.dropoff = this.spawn.id;
		}
		if (creep.memory.parent != this.spawn.id) {
			//this.spawn.memory.extensions[creep.memory.dropoff] += 1;
			creep.memory.parent = this.spawn.id;
		}
	},
	freeSourceNode: function(creep) {
		if (creep.memory.task == "getEnergy" && creep.memory.target != "") {
			var par = Game.getObjectById(creep.memory.parent);
			if (par == null) return;
			if (par.memory.dronesAtSources[creep.memory.target] != undefined)
				par.memory.dronesAtSources[creep.memory.target] += 1;
			else if (par.room.memory.freeEnergy[creep.memory.target] != undefined)
				par.room.memory.freeEnergy[creep.memory.target] += 1;

			creep.memory.target = "";
		}
	},
	getEnergy: function(creep) {
		var src = Game.getObjectById(creep.memory.target);
		if ((src == undefined || src == null) && creep.memory.internalTask < 2) {
			creep.memory.internalTask = 2;
		}
		if (creep.memory.internalTask == null) {
			if (creep.pos.getRangeTo(src) < 2)
				creep.memory.internalTask = 1;
			else {
				this.creepGoTo(creep, src);
				return;
			}
		}
		if (creep.memory.internalTask == 1) {
			if (creep.carry.energy == creep.carryCapacity || (src.energy == 0 && creep.carry.energy > 0))
				creep.memory.internalTask = 2;
			else {
				creep.harvest(src);
				creep.pickup(src);
				return;
			}
		}
		if (creep.memory.internalTask == 2) {
			var par = Game.getObjectById(creep.memory.parent);
			if (this.spawn.room.memory.library["use"] == false && creep.memory.dropoff == creep.memory.parent && par.energy >= par.energyCapacity * .95) {
				for (var s in par.room.memory.extensions) {
					var o = Game.getObjectById(s);
					if (o == null) continue;
					if (par.room.memory.extensions[s] > 0 && o.energy != o.energyCapacity) {
						par.room.memory.extensions[s] -= 1;
						creep.memory.dropoff = s;
						console.log("Redirecting " + creep.name + " to an extension");
						break;
					}
				}
			}
			var drop = Game.getObjectById(creep.memory.dropoff);
			this.creepGoTo(creep, drop);
			this.freeSourceNode(creep);
			
			if (creep.pos.getRangeTo(drop) < 2)
				creep.memory.internalTask = 3;
			else return;
		}
		if (creep.memory.internalTask == 3) {
			var drop = Game.getObjectById(creep.memory.dropoff);
			creep.transferEnergy(drop);
			
			if (creep.carry.energy == 0 || drop == null) {
				var par = Game.getObjectById(creep.memory.parent);
				this.freeExtension(creep);
				par.memory.freeDrones[creep.name] = creep.memory.role;
				creep.memory.internalTask = null;
				creep.memory.task = "";
				return;
			} else if (drop.energy != undefined && drop.energy == drop.energyCapacity) {
				this.creepGoTo(creep, src);
				creep.memory.internalTask = 2;
				this.freeExtension(creep);
				return;
			}
		}
	},
	getFarEnergy: function(creep) {
		if (creep.memory.internalTask == null) {
			if (this.goAfar(creep, creep.memory.target) == false) {
				creep.memory.internalTask = 4;
			}

			if (creep.room.name == creep.memory.target) {
				delete creep.memory.dest;
				creep.memory.internalTask = 1;
			} else {
				if (creep.memory.dest != undefined)
					this.creepGoTo(creep, creep.room.getPositionAt(creep.memory.dest[0], creep.memory.dest[1]));
				return;
			}
		}
		if (creep.memory.internalTask == 1) {
			if (creep.room.name != creep.memory.target) return;
			if (creep.memory.sourceTarget == undefined) {
				var src = creep.pos.findClosest(FIND_SOURCES);
				if (src != undefined && src != null)
					creep.memory.sourceTarget = src.id;
			}

			var src = Game.getObjectById(creep.memory.sourceTarget);

			if (creep.pos.getRangeTo(src) < 2)
				creep.memory.internalTask = 2;
			else if (src == null || src.room.name != creep.memory.target) {
				creep.memory.sourceTarget = undefined;
				creep.memory.internalTask = null;
			} else {
				this.creepGoTo(creep, src);
				return;
			}
		}
		if (creep.memory.internalTask == 2) {
			var src = Game.getObjectById(creep.memory.sourceTarget);
			creep.harvest(src);
			creep.pickup(src);
			
			if (creep.carry.energy == creep.carryCapacity || (src.energy == 0 && creep.carry.energy > 0))
				creep.memory.internalTask = 3;
			else return;
		}
		if (creep.memory.internalTask == 3) {
			if (this.goAfar(creep, creep.memory.dropoff) == false) {
				creep.memory.internalTask = 4;
			}

			if (creep.room.name == creep.memory.dropoff) {
				delete creep.memory.dest;
				creep.memory.internalTask = 4;
			} else {
				if (creep.memory.dest != undefined)
					this.creepGoTo(creep, creep.room.getPositionAt(creep.memory.dest[0], creep.memory.dest[1]));
				return;
			}
		}
		if (creep.memory.internalTask == 4) {
			if (creep.room.name != creep.memory.dropoff) return;

			var link = Game.getObjectById(creep.memory.linkTarget);

			if (creep.pos.getRangeTo(link) < 2)
				creep.memory.internalTask = 5;
			else {
				this.creepGoTo(creep, link);
				return;
			}
		}
		if (creep.memory.internalTask == 5) {
			var link = Game.getObjectById(creep.memory.linkTarget);
			creep.transferEnergy(link);
			
			if (creep.carry.energy == 0 || link == null) {
				if (creep.memory.totalEnergyDelivered == undefined)
					creep.memory.totalEnergyDelivered = creep.carryCapacity;
				else
					creep.memory.totalEnergyDelivered += creep.carryCapacity;
				this.freeExtension(creep);
				var par = Game.getObjectById(creep.memory.parent);
				par.memory.freeDrones[creep.name] = creep.memory.role;
				par.memory.roomsCovered[creep.memory.target] += 1;
				creep.memory.target = "";
				creep.memory.lastPath = "";
				creep.memory.internalTask = null;
				creep.memory.task = "";
			}
		}
	},
	manageLibrary: function(creep) {
		var src = Game.getObjectById(creep.room.memory.library["link"]);
		if (src == undefined || src == null || src.energy == 0 || creep.carry.energy != 0) {
			src = Game.getObjectById(creep.memory.target);
		} else {
			this.freeExtension(creep);
			creep.memory.dropoff = creep.memory.target;
		}
		if (src == undefined || src == null) {
			console.log("Librarian missing library");
			return;
			/*var par = Game.getObjectById(creep.memory.parent);
			creep.memory.internalTask = null;
			par.memory.freeDrones[creep.name] = creep.memory.role;
			creep.memory.task = "";*/
		}
		if (this.spawn.room.memory.library["age"] > creep.ticksToLive)
			this.spawn.room.memory.library["age"] = creep.ticksToLive;

		if (creep.memory.dropoff == null) {
			if (this.spawn.energy != this.spawn.energyCapacity) {
				creep.memory.dropoff = this.spawn.id;
				//console.log("Librarian " + creep.name + " filling spawner " + this.spawn.name);
			} else {
				var neededExtens = [];
				for (var s in this.spawn.room.memory.extensions) {
					var o = Game.getObjectById(s);
					if (o == null) continue;
					if (this.spawn.room.memory.extensions[s] > 0 && o.energy != o.energyCapacity) {
						neededExtens.push(Game.getObjectById(s));
						//console.log("Librarian " + creep.name + " filling extension");
					}
				}
				var s = creep.pos.findClosestByRange(neededExtens);
				if (s != null) {
					this.spawn.room.memory.extensions[s.id] -= 1;
					creep.memory.dropoff = s.id;
				}
			}
		}
		/*if (creep.memory.dropoff == null) {
			var src = Game.getObjectById(creep.room.memory.library["link"]);
			if (src != null && src.energy > 0) {
				this.freeExtension(creep);
				creep.memory.dropoff = creep.memory.target;
			}
		}*/

		var drop = Game.getObjectById(creep.memory.dropoff);

		if (drop == null || creep.carry.energy == 0) {
			creep.memory.internalTask = null;
		}

		if (creep.memory.internalTask == null) {
			if (creep.pos.getRangeTo(src) < 2)
				creep.memory.internalTask = 1;
			else {
				this.creepGoTo(creep, src, true);
				return;
			}
		}
		if (creep.memory.internalTask == 1) {
			if (drop != null)
				src.transferEnergy(creep);
			else
				creep.transferEnergy(src);
			
			if (creep.carry.energy == creep.carryCapacity || src.energy == 0 || creep.pos.getRangeTo(src) >= 2)
				creep.memory.internalTask = 2;
			else return;
		}
		if (creep.memory.internalTask == 2) {
			if (creep.pos.getRangeTo(drop) < 2)
				creep.memory.internalTask = 3;
			else if (drop != null) {
				this.creepGoTo(creep, drop, true);
				return;
			} else return;
		}
		if (creep.memory.internalTask == 3) {
			creep.transferEnergy(drop);
			
			if (drop.energy == drop.energyCapacity) {
				this.freeExtension(creep);
				if (creep.carry.energy > 0) {
					creep.memory.internalTask = 2;
				} else {
					creep.memory.internalTask = null;
				}
				creep.memory.dropoff = null;
			} else if (creep.carry.energy == 0) {
				creep.memory.internalTask = null;
			} else if (creep.pos.getRangeTo(drop) >= 2)
				creep.memory.internalTask = 2;
		}
	},
	transferToRCL: function(creep) {
		var cont = Game.getObjectById(creep.memory.target);
		var drop = Game.getObjectById(creep.memory.dropoff);
		if (creep.memory.internalTask == null) {
			if (creep.pos.getRangeTo(drop) < 2)
				creep.memory.internalTask = 1;
			else {
				this.creepGoTo(creep, drop);
			}
		}
		if (creep.memory.internalTask == 1) {
			drop.transferEnergy(creep);
			
			if (creep.carry.energy == creep.carryCapacity)
				creep.memory.internalTask = 2;
			else return;
		}
		if (creep.memory.internalTask == 2) {
			if (creep.pos.getRangeTo(cont) < 2)
				creep.memory.internalTask = 3;
			else {
				this.creepGoTo(creep, cont);
				return;
			}
		}
		if (creep.memory.internalTask == 3) {
			creep.upgradeController(cont);
			
			if (creep.carry.energy == 0)
				creep.memory.internalTask = 4;
			else return;
		}
		if (creep.memory.internalTask == 4) {	
			if (creep.pos.getRangeTo(drop) < 2) {
				var par = Game.getObjectById(creep.memory.parent);
				creep.memory.internalTask = null;
				par.memory.freeDrones[creep.name] = creep.memory.role;
				creep.memory.task = "";
			} else
				this.creepGoTo(creep, drop);
		}
	},
	transferToFarRCL: function(creep) {
		if (creep.memory.internalTask == null) {
			var drop = Game.getObjectById(creep.memory.dropoff);
			this.creepGoTo(creep, drop);
			
			if (creep.pos.getRangeTo(drop) < 2)
				creep.memory.internalTask = 1;
			else return;
		}
		if (creep.memory.internalTask == 1) {
			var drop = Game.getObjectById(creep.memory.dropoff);
			drop.transferEnergy(creep);
			
			if (creep.carry.energy == creep.carryCapacity)
				creep.memory.internalTask = 2;
			else return;
		}
		if (creep.memory.internalTask == 2) {
			if (this.goAfar(creep, creep.memory.target) == false) {
				creep.memory.internalTask = 5;
			}

			if (creep.memory.dest != undefined)
				this.creepGoTo(creep, creep.room.getPositionAt(creep.memory.dest[0], creep.memory.dest[1]));

			if (creep.room.name == creep.memory.target) {
				delete creep.memory.dest;
				creep.memory.internalTask = 3;
			}
			else return;
		}
		if (creep.memory.internalTask == 3) {
			if (creep.room.name != creep.memory.target) return;
			if (creep.memory.contTarget == undefined)
				creep.memory.contTarget = creep.room.controller.id;

			var src = Game.getObjectById(creep.memory.contTarget);
			creep.moveTo(src);
			if (creep.pos.getRangeTo(src) < 2)
				creep.memory.internalTask = 4;
			else return;
		}
		if (creep.memory.internalTask == 4) {
			var src = Game.getObjectById(creep.memory.contTarget);
			creep.claimController(src);
			creep.upgradeController(src);
			
			if (creep.carry.energy == 0) {
				delete creep.memory.contTarget;
				creep.memory.internalTask = 5;
			}
			else return;
		}
		if (creep.memory.internalTask == 5) {
			var pname = Game.getObjectById(creep.memory.parent).room.name;
			if (this.goAfar(creep, pname) == false) {
				creep.memory.internalTask = 5;
			}

			if (creep.memory.dest != undefined)
				this.creepGoTo(creep, creep.room.getPositionAt(creep.memory.dest[0], creep.memory.dest[1]));

			if (creep.room.name == pname) {
				delete creep.memory.dest;
				creep.memory.internalTask = 6;
			}
		}
		if (creep.memory.internalTask == 6) {
			var drop = Game.getObjectById(creep.memory.dropoff);
			this.creepGoTo(creep, drop);
			
			if (creep.pos.getRangeTo(drop) < 2) {
				var par = Game.getObjectById(creep.memory.parent);
				creep.memory.internalTask = null;
				par.memory.freeDrones[creep.name] = creep.memory.role;
				creep.memory.task = "";
				creep.memory.lastPath = "";
			}
		}
	},
	buildSite: function(creep) {
		var site = Game.getObjectById(creep.memory.target);
		var drop = Game.getObjectById(creep.memory.dropoff);
		if (site == null) {
			creep.memory.internalTask = 4;
		}

		if (creep.memory.internalTask == null) {
			this.creepGoTo(creep, drop);
			
			if (creep.pos.getRangeTo(drop) < 2)
				creep.memory.internalTask = 1;
			else return;
		}
		if (creep.memory.internalTask == 1) {
			drop.transferEnergy(creep);
			
			if (creep.carry.energy == creep.carryCapacity)
				creep.memory.internalTask = 2;
			else if (creep.pos.getRangeTo(drop) >= 2)
				creep.memory.internalTask = null;
			else return;
		}
		if (creep.memory.internalTask == 2) {
			if (creep.pos.getRangeTo(site) < 2)
				creep.memory.internalTask = 3;
			else {
				this.creepGoTo(creep, site);
				return;
			}
		
		}
		if (creep.memory.internalTask == 3) {
			creep.build(site);
			creep.repair(site);

			if (site.progress != undefined && site.structureType == "rampart") {
				creep.memory.workingOnRampart = [site.pos.x, site.pos.y];
				return;
			}

			if (creep.carry.energy == 0 || site == undefined || ((site.progress == undefined || site.progress == site.progressTotal) && site.hits / site.hitsMax >= creep.room.memory.buildWallsPercent*2 && (site.hits / site.hitsMax == 1 || site.hits >= creep.room.memory.buildWallsTo*2)))
				creep.memory.internalTask = 4;
			else if (creep.pos.getRangeTo(site) >= 2)
				creep.memory.internalTask = 2;
			else return;
		}
		if (creep.memory.internalTask == 4) {
			if (creep.memory.workingOnRampart != undefined) {
				var onSite = creep.room.lookAt(creep.memory.workingOnRampart[0], creep.memory.workingOnRampart[1]);
				for (var e in onSite) {
					if (onSite[e].structure != undefined && onSite[e].structure.structureType == "rampart") {
						console.log("Initial build up of rampart");
						creep.memory.target = onSite[e].structure.id;
						creep.memory.internalTask = 2;
						break;
					}
				}

				delete creep.memory.workingOnRampart;
				return;
			}
			if (creep.carry.energy > 0) {
				var o = this.getWorkSite(creep);
				if (o != null) {
					creep.memory.internalTask = 2;
					creep.memory.target = o.id;
					return;
				}
			}
			var par = Game.getObjectById(creep.memory.parent);
			this.creepGoTo(creep, par);
			
			if (creep.pos.getRangeTo(par) < 2) {
				creep.memory.internalTask = null;
				par.memory.freeDrones[creep.name] = creep.memory.role;
				creep.memory.task = "";
			}
		}
	},
	buildFarSite: function(creep) {
		if (creep.memory.internalTask == null) {
			var drop = Game.getObjectById(creep.memory.dropoff);
			this.creepGoTo(creep, drop);
			
			if (creep.pos.getRangeTo(drop) < 2)
				creep.memory.internalTask = 1;
			else return;
		}
		if (creep.memory.internalTask == 1) {
			var drop = Game.getObjectById(creep.memory.dropoff);
			drop.transferEnergy(creep);
			
			if (creep.carry.energy == creep.carryCapacity)
				creep.memory.internalTask = 2;
			else return;
		}
		if (creep.memory.internalTask == 2) {
			if (this.goAfar(creep, creep.memory.target) == false) {
				creep.memory.internalTask = 4;
			}

			if (creep.memory.dest != undefined)
				creep.moveTo(creep.memory.dest[0], creep.memory.dest[1]);

			if (creep.room.name == creep.memory.target) {
				delete creep.memory.dest;
				creep.memory.internalTask = 3;
			} else return;
		}
		if (creep.memory.internalTask == 3) {
			if (creep.room.name != creep.memory.target) return;
			if (creep.memory.contTarget == undefined) {
				var st = this.getWorkSite(creep);
				if (st != null)
					creep.memory.contTarget = st.id;
				else
					creep.memory.internalTask = 6;
			}

			var src = Game.getObjectById(creep.memory.contTarget);
			creep.moveTo(src);
			if (src == undefined)
				creep.memory.contTarget = undefined;
			if (creep.pos.getRangeTo(src) < 2)
				creep.memory.internalTask = 4;
			else return;
		}
		if (creep.memory.internalTask == 4) {
			var src = Game.getObjectById(creep.memory.contTarget);
			creep.build(src);
			
			if (creep.carry.energy == 0) {
				delete creep.memory.contTarget;
				creep.memory.internalTask = 5;
			} else if (src == null || src.progress == undefined) {
				delete creep.memory.contTarget;
				creep.memory.internalTask = 3;
			} else return;
		}
		if (creep.memory.internalTask == 5) {
			var pname = Game.getObjectById(creep.memory.parent).room.name;
			if (this.goAfar(creep, pname) == false) {
				creep.memory.internalTask = 4;
			}

			if (creep.memory.dest != undefined)
				creep.moveTo(creep.memory.dest[0], creep.memory.dest[1]);

			if (creep.room.name == pname) {
				delete creep.memory.dest;
				creep.memory.internalTask = 6;
			}
		}
		if (creep.memory.internalTask == 6) {
			var drop = Game.getObjectById(creep.memory.dropoff);
			this.creepGoTo(creep, drop);
			
			if (creep.pos.getRangeTo(drop) < 2) {
				var par = Game.getObjectById(creep.memory.parent);
				creep.memory.internalTask = null;
				par.memory.distantBuilder += 1;
				par.memory.freeDrones[creep.name] = creep.memory.role;
				creep.memory.task = "";
				creep.memory.lastPath = "";
			}
		}
	},
	repairSite: function(creep) {
		var site = Game.getObjectById(creep.memory.target);
		var drop = Game.getObjectById(creep.memory.dropoff);
		if (site == null) {
			creep.memory.internalTask = 4;
		}

		if (creep.memory.internalTask == null) {
			this.creepGoTo(creep, drop);
			
			if (creep.pos.getRangeTo(drop) < 2)
				creep.memory.internalTask = 1;
			else return;
		}
		if (creep.memory.internalTask == 1) {
			drop.transferEnergy(creep);
			
			if (creep.carry.energy == creep.carryCapacity)
				creep.memory.internalTask = 2;
			else if (creep.pos.getRangeTo(drop) >= 2)
				creep.memory.internalTask = null;
			else return;
		}
		if (creep.memory.internalTask == 2) {
			this.creepGoTo(creep, site);
			
			if (creep.pos.getRangeTo(site) < 2)
				creep.memory.internalTask = 3;
			else return;
		}
		if (creep.memory.internalTask == 3) {
			creep.repair(site);

			if (creep.carry.energy == 0 || site == undefined || site.hits == site.hitsMax)
				creep.memory.internalTask = 4;
			else return;
		}
		if (creep.memory.internalTask == 4) {
			if (creep.carry.energy > 0) {
				var o = undefined;
				for (var rs in creep.room.memory.repairStructs) {
					o = Game.getObjectById(rs);
					break;
				}
				if (o != undefined && o != null) {
					delete creep.room.memory.repairStructs[o.id];
					creep.memory.internalTask = 2;
					creep.memory.target = o.id;
					return;
				}
			}
			var par = Game.getObjectById(creep.memory.parent);
			this.creepGoTo(creep, par);
			
			if (creep.pos.getRangeTo(par) < 2) {
				creep.memory.internalTask = null;
				par.memory.freeDrones[creep.name] = creep.memory.role;
				creep.memory.task = "";
			}
		}
	},
	undraftedArmy: function(creep) {
		var flag = Game.flags["Undrafted"];
		if (flag == undefined) return;
		if (Memory.army.taskForces[creep.memory.parent] != undefined) {
			creep.memory.task = "routineArmy";
			this.routineArmy(creep);
			return;
		}
		if (creep.pos.getRangeTo(flag) > 3)
			this.creepGoTo(creep, flag);
	},
	routineArmy: function(creep) {
		var tf = Memory.army.taskForces[creep.memory.parent];
		creep.memory.target = undefined;
		if (tf == undefined) {
			creep.memory.task = "routineArmy";
			Memory.army.freeUnits[creep.memory.role.substring(0, 1)].push(creep.id);
			return;
		}
		if (tf.activeOrders == true) {
			switch (tf.role) {
				case "roomDefense":
					creep.memory.task = "roomDefense";
					this.roomDefense(creep);
				return;
				case "attackRoom":
					creep.memory.task = "attackRoom";
					this.attackRoom(creep);
				return;
			}
		}
		var flag = Game.flags[creep.memory.parent + "-Meet"];
		if (creep.pos.getRangeTo(flag) > 2)
			this.creepGoTo(creep, flag);
	},
	roomDefense: function(creep) {
		var tf = Memory.army.taskForces[creep.memory.parent];
		if (tf.activeOrders == false) {
			creep.memory.task = "routineArmy";
			return;
		}

		if (Memory.army.localEnemyCount != 0) {
			var tar = null;
			if (creep.memory.target == undefined || tar == null) {
				for (var e in Memory.army.localEnemies) {
					tar = Game.getObjectById(e);
					if (tar == null) continue;
					creep.memory.target = tar.id;
				}
			}
		}

		if (tar == null) {
			if (creep.hits < creep.hitsMax)
				creep.heal(creep);
			var flag = Game.flags[creep.memory.parent + "-Meet"];
			if (creep.pos.getRangeTo(flag) > 2)
				this.creepGoTo(creep, flag);
		} else {
			if (creep.memory.role == "ranged") {
				Game.notify("Ranged " + creep.name + " in room " + tar.room.name + " engaging with " + tar.id);
				//console.log(tar.room.name + " " + creep.room.name);
				if (tar.room.name == creep.room.name) {
					var rng = creep.pos.getRangeTo(tar);
					if ((rng > 3 && Memory.army.localEnemyCount < 5) || (rng > 2 && Memory.army.localEnemyCount >= 5)) {
						if (creep.hits < creep.hitsMax)
							creep.heal(creep);
						this.creepGoTo(creep, tar);
						if (creep.memory.lastMove == undefined || creep.memory.lastMove != 1)
							console.log("HOSTILE: " + creep.name + " moving towards " + tar.name);
						creep.memory.lastMove = 1;
					} else if (rng <= 1 || creep.hits / creep.hitsMax < .5) {
						this.creepGoTo(creep, Game.flags[creep.room.memory.blockFlag]);
						if (creep.memory.lastMove == undefined || creep.memory.lastMove != 2)
							console.log("HOSTILE: " + creep.name + " distancing from " + tar.name);
						creep.memory.lastMove = 2;
					} else if (rng <= 3 && Memory.army.localEnemyCount < 5) {
						creep.rangedAttack(tar);
						if (creep.memory.lastMove == undefined || creep.memory.lastMove != 3)
							console.log("HOSTILE: " + creep.name + " attacking " + tar.name);
						creep.memory.lastMove = 3;
					} else if (rng <= 2 && Memory.army.localEnemyCount >= 5) {
						creep.rangedMassAttack();
						if (creep.memory.lastMove == undefined || creep.memory.lastMove != 4)
							console.log("HOSTILE: " + creep.name + " mass attacking " + tar.name);
						creep.memory.lastMove = 4;
					}
				} else {
					this.creepGoTo(creep, tar);
				}
			}
		}

		tf.units[creep.name] = creep.hits / creep.hitsMax;
	},
	attackRoom: function(creep) {
		var tf = Memory.army.taskForces[creep.memory.parent];
		if (tf.activeOrders == false) {
			creep.memory.task = "routineArmy";
			return;
		}

		var stagingFlag = Game.flags[creep.memory.parent + "-Staging"];
		var attacking = false;

		if (stagingFlag == undefined) {
			var flag = Game.flags[creep.memory.parent + "-Meet"];
			if (creep.pos.getRangeTo(flag) > 2)
				this.creepGoTo(creep, flag);
		} else {
			var attackFlag = Game.flags[creep.memory.parent + "-Attack"];
			if (attackFlag == undefined) {
				if (creep.pos.getRangeTo(stagingFlag) > 2)
					this.creepGoTo(creep, stagingFlag);
			} else {
				var atkRng = creep.pos.getRangeTo(attackFlag);
				var tar = creep.room.lookAt(attackFlag);
				var structTar = undefined;
				for (var i in tar) {
					if (tar[i].structure != undefined && tar[i].structure.structureType != "road") {
						structTar = tar[i].structure;
						break;
					}
				}
				if (structTar != undefined) {
					if (creep.memory.role == "melee") {
						var rng = creep.pos.getRangeTo(structTar);
						if (rng >= 2) {
							this.creepGoTo(creep, structTar);
							return;
						} else {
							if (creep.memory.lastMove == undefined || creep.memory.lastMove != 1)
								console.log("ATTACK: " + creep.name + " attacking " + structTar + " (" + structTar.hits + "/" + structTar.hitsMax + ")");
							creep.memory.lastMove = 1;
							creep.attack(structTar);
							attacking = true;
						}
					}
				} else {
					creep.memory.lastMove = 0;
					this.creepGoTo(creep, stagingFlag);
				}
			}
		}

		if (creep.hits < creep.hitsMax && !attacking)
			creep.heal(creep);

		tf.units[creep.name] = creep.hits / creep.hitsMax;
	},
	cleanup: function() {
		for (var c in Memory.creeps) {
			if (Game.creeps[c] == undefined) {
				if (Memory.creeps[c].role != undefined) {
					if (Memory.creeps[c].role == "ranged" || Memory.creeps[c].role == "melee" || Memory.creeps[c].role == "healer") {
						var tf = Memory.army.taskForces[Memory.creeps[c].parent];
						var role = Memory.creeps[c].role.substring(0, 1);
						if (tf != undefined) {
							tf.unitCount[role] -= 1;
							delete tf.units[c];
						} else {
							if (Memory.creeps[c].self != undefined) {
								for (var i in Memory.army.freeUnits[role]) {
									if (Memory.army.freeUnits[role][i] == Memory.creeps[c].self) {
										Memory.army.freeUnits[role].splice(i, 1);
										break;
									}
								}
							}
						}
					} else {
						var par = Game.getObjectById(Memory.creeps[c].parent);
						if (par == null) continue;
						par.memory.droneCount -= 1;
						par.memory.totalDrones[Memory.creeps[c].role.substring(0, 1)] -= 1;
						if (par.memory.roomsCovered[Memory.creeps[c].target] != undefined)
							par.memory.roomsCovered[Memory.creeps[c].target] += 1;

						var o = Game.getObjectById(Memory.creeps[c].dropoff);
						if (o != null && o.structureType == "extension")
							par.room.memory.extensions[Memory.creeps[c].dropoff] += 1;

						if (Memory.creeps[c].task == "getEnergy" && Memory.creeps[c].target != "") {
							var par = Game.getObjectById(Memory.creeps[c].parent);
							
							if (par.memory.dronesAtSources[Memory.creeps[c].target] != undefined)
								par.memory.dronesAtSources[Memory.creeps[c].target] += 1;
							else if (par.room.memory.freeEnergy[Memory.creeps[c].target] != undefined)
								par.room.memory.freeEnergy[Memory.creeps[c].target] += 1;
						}
						if (Memory.creeps[c].task == "buildFarSite") {
							par.memory.distantBuilder += 1;
						}
						if (par.memory.freeDrones[c] != undefined) {
							delete par.memory.freeDrones[c];
						}
					}

					var totDel = Memory.creeps[c].totalEnergyDelivered;
					if (totDel == undefined)
						console.log(c + " has died");
					else console.log(c + " has died (delivered " + totDel + ")")
				}
				delete Memory.creeps[c];
			}
		}
		for (var r in Memory.rooms) {
			if (Memory.rooms[r].stuckCreeps == undefined) continue;
			for (var sc in Memory.rooms[r].stuckCreeps) {
				if (Game.getObjectById(sc) == undefined)
					delete Memory.rooms[r].stuckCreeps[sc];
			}
		}
	},
	creeps: function(rm) {
		if (this.spawn.room.memory.library != undefined)
			this.spawn.room.memory.library["age"] = 10000;
		for (var cname in Game.creeps) {
			var creep = Game.creeps[cname];
			if (creep.room.name != rm) continue;
			switch (creep.memory.task) {
				case "getEnergy":
					this.getEnergy(creep);
				break;
				case "getFarEnergy":
					this.getFarEnergy(creep);
				break;
				case "transferToRCL":
					this.transferToRCL(creep);
				break;
				case "transferToFarRCL":
					this.transferToFarRCL(creep);
				break;
				case "repairSite":
					this.repairSite(creep);
				break;
				case "buildSite":
					this.buildSite(creep);
				break;
				case "buildFarSite":
					this.buildFarSite(creep);
				break;
				case "manageLibrary":
					this.manageLibrary(creep);
				break;
				case "undraftedArmy":
					this.undraftedArmy(creep);
				break;
				case "routineArmy":
					this.routineArmy(creep);
				break;
				case "roomDefense":
					this.roomDefense(creep);
				break;
				case "attackRoom":
					this.attackRoom(creep);
				break;
			}
		}
	},
	flagMaintenance: function() {
		var newPathName = undefined;
		for (var f in Game.flags) {
			var flag = Game.flags[f];
			if (flag.color == "green") {
				newPathName = flag.name;
			} else if (flag.color == "brown") {
				if (flag.room.name != undefined && Memory.rooms[flag.room.name].impassableFlags != undefined)
					Memory.rooms[flag.room.name].impassableFlags[flag.name] = 2;
			}
		}
		if (newPathName != undefined) {
			var path = [];
			var num = 1;
			var lastNum = 0;
			while (num != lastNum) {
				lastNum = num;
				for (var f in Game.flags) {
					if (f.substring(0, 4) != "Flag") continue;
					var cnum = parseInt(f.substring(4));
					if (cnum == num) {
						if (num > 1) {
							var shortPath = Game.flags["Flag" + (num - 1)].pos.findPathTo(Game.flags[f]);
							for (var point in shortPath) {
								path.push([shortPath[point].x, shortPath[point].y]);
							}
							Game.flags["Flag" + (num - 1)].remove();
						}
						num++;
					}
				}
			}
			Memory.paths[newPathName] = path;
		}
	},
	taskForceMaintenance: function() {
		var ma = Memory.army;
		var currentNeeds = {};
		for (var tf in ma.taskForces) {
			var tfo = ma.taskForces[tf];
			for (var db in tfo.desiredBuild) {
				if (tfo.unitCount[db] < tfo.desiredBuild[db] || tfo.unitCount[db] == undefined) {
					if (ma.freeUnits[db].length > 0 && ma.freeUnits[db] != undefined) {
						var id = ma.freeUnits[db][0];
						var unit = Game.getObjectById(id);

						if (unit != null) {
							tfo.units[unit.name] = unit.hits / unit.hitsMax;
							if (tfo.unitCount[db] == undefined)
								tfo.unitCount[db] = 1;
							else
								tfo.unitCount[db] += 1;
							unit.memory.parent = tf;
						}

						ma.freeUnits[db].splice(0, 1);
					} else if (tfo.desiredBuild[db] > 0) {
						if (currentNeeds[db] == undefined)
							currentNeeds[db] = 1;
						else
							currentNeeds[db] += 1;
					}
				} else if (tfo.unitCount[db] > tfo.desiredBuild[db] && tfo.unitCount[db] != undefined) {
					//ma.freeUnits[db].push()
					//allow a unit to be returned to the free pool
				}
			}
		}
		for (var type in currentNeeds) {
			if (ma.droneNeeds[type] + ma.droneNeedsFilled[type] < currentNeeds[type] || ma.droneNeeds[type] == undefined) {
				ma.droneNeeds[type] += currentNeeds[type];
			}
		}
	},
	setupLibrary: function() {
		this.spawn.room.memory.library = {};
		this.spawn.room.memory.library["age"] = 0;
		this.spawn.room.memory.library["use"] = false;
		this.spawn.room.memory.library["link"] = null;
		this.spawn.room.memory.library["primary"] = "";
		var structs = this.spawn.room.find(FIND_MY_STRUCTURES);
		for (var struct in structs) {
			if (structs[struct].progress == undefined && structs[struct].structureType == "storage") {
				this.spawn.room.memory.library["primary"] = structs[struct].id;
				break;
			}
		}
	},
	setupSpawn: function() {
		this.spawn = Game.spawns[this.spawnName];
		if (this.spawn.memory.started == 1) return;
		this.spawn.memory.lastDrone = 0;
		this.spawn.memory.attrType = 0;
		this.spawn.memory.distantBuilder = 0;
		this.spawn.memory.droneCount = 0;
		this.spawn.memory.started = 1;
		this.spawn.memory.assignFreeDrones = true;
		this.spawn.memory.prefix = "";
		this.spawn.memory.freeDrones = {};
		this.spawn.memory.totalDrones = {};
		this.spawn.memory.dronesAtSources = {};
		this.spawn.memory.roomsCovered = {};
		this.spawn.memory.roomLinks = {};
		this.spawn.memory.buildRules = {"h": 6, "b": 2, "l": 0, "c": 3, "f": 0};
		if (this.spawn.room.memory.roads == undefined) {
			this.spawn.room.memory.buildWallsPercent = .025;
			this.spawn.room.memory.constructedWallsPercent = .0001;
			this.spawn.room.memory.buildWallsTo = 10000;
			this.spawn.room.memory.roads = {};
			this.spawn.room.memory.freeEnergy = {};
			this.spawn.room.memory.extensions = {};
			this.spawn.room.memory.builtWalls = {};
			this.spawn.room.memory.ramparts = {};
			this.spawn.room.memory.stuckCreeps = {};
			this.spawn.room.memory.repairStructs = {};
			this.spawn.room.memory.impassableFlags = {};
			this.spawn.room.memory.blockFlag = "EmptyArea";
			this.spawn.room.memory.library = {"age": 0, "use": false, "link": null, "primary": undefined};
		}
		var sources = this.spawn.room.find(FIND_SOURCES);
		for (var i = 0; i < sources.length; ++i) {
			this.spawn.memory.dronesAtSources[sources[i].id] = 4;
		}
		console.log("Successfully set up spawner");
		return 0;
	},
	setupArmy: function() {
		if (Memory.army == undefined) {
			Memory.army = {};
			Memory.army.localEnemies = {};
			Memory.army.localEnemyCount = 0;
			Memory.army.droneNeedsFilled = {};
			Memory.army.droneNeeds = {};
			Memory.army.taskForces = {};
			Memory.army.freeUnits = {"r": [], "m": [], "h": []};
			Memory.army.taskForces["Defense"] = {role: "roomDefense", activeOrders: false, units: {}, desiredBuild: {"r": 0}, unitCount: {}};
		}
	},
	decideBuildRules: function() {
		var rm = this.spawn.room;
		var mem = this.spawn.memory;

		var harvestersNeeded = mem.buildRules["h"];
		var buildersNeeded = mem.buildRules["b"];
		var librariansNeeded = mem.buildRules["l"];
		var controllerKeepersNeeded = mem.buildRules["c"];
		var farHarvestersNeeded = mem.buildRules["f"];
		var librarianBuffer = 150;

		var hDrones = this.spawn.memory.totalDrones["h"];
		var bDrones = this.spawn.memory.totalDrones["b"];
		var cDrones = this.spawn.memory.totalDrones["c"];
		var lDrones = this.spawn.memory.totalDrones["l"];
		var fDrones = this.spawn.memory.totalDrones["f"];

		var dt = this.droneAttrs;
		if (this.spawn.memory.attrType == 2)
			dt = this.droneAttrs2;
		
		var libPrim = Game.getObjectById(rm.memory.library["primary"]);
		if ((hDrones == undefined || hDrones < harvestersNeeded - 1) && ((rm.memory.library["use"] == true && libPrim != null && libPrim.energy < 10000) || rm.memory.library["use"] == false)) {
			mem.noBuilding = 1;
		} else {
			mem.noBuilding = 0;
		}

		if (rm.memory.library["use"] == true && rm.memory.energy >= this.droneCost(dt["l"]) && ((lDrones == undefined || lDrones < librariansNeeded) || (rm.memory.library["age"] < librarianBuffer && (lDrones == undefined || lDrones <= 1)))) {
			this.newDrone("l");
		} else if (rm.memory.library["use"] == false || rm.memory.library["age"] > librarianBuffer || lDrones > 1) {
			if (rm.memory.energy >= this.droneCost(dt["h"]) && (hDrones == undefined || hDrones < harvestersNeeded)) {
				this.newDrone("h");
			} else if (rm.memory.energy >= this.droneCost(dt["f"]) && (fDrones == undefined || fDrones < farHarvestersNeeded) && mem.roomsCovered != undefined) {
				this.newDrone("f");
			} else if (rm.memory.energy >= this.droneCost(dt["b"]) && hDrones >= harvestersNeeded - 1 && (bDrones == undefined || bDrones < buildersNeeded)) {
				this.newDrone("b");
			} else if (rm.memory.energy >= this.droneCost(dt["c"]) && hDrones >= harvestersNeeded - 1 && (cDrones == undefined || cDrones < controllerKeepersNeeded)) {
				this.newDrone("c");
			} else if (Memory.army != undefined && hDrones >= harvestersNeeded - 2 && this.spawn.spawning == null) {
				var unass = false;
				for (var d in mem.freeDrones) {
					if (mem.freeDrones[d] == "ranged" || mem.freeDrones[d] == "melee" || mem.freeDrones[d] == "healer") {
						unass = true;
						break;
					}
				}
				if (unass == false) {
					for (var dn in Memory.army.droneNeeds) {
						if (dt[dn] == undefined) continue;
						if (rm.memory.energy >= this.droneCost(dt[dn]) && Memory.army.droneNeeds[dn] > 0) {
							this.newDrone(dn);
							Memory.army.droneNeeds[dn] -= 1;
							Memory.army.droneNeedsFilled[dn] += 1;
							break;
						}
					}
				}
			}
		}
	},
	spawner: function() {
		if (this.spawn == undefined) return;

		var rm = this.spawn.room;
		var mem = this.spawn.memory;
		
		this.decideBuildRules();


		if (rm.memory.library["use"] == true) {
			var libLink = Game.getObjectById(rm.memory.library["link"]);
			for (var link in mem.roomLinks) {
				var lobj = Game.getObjectById(mem.roomLinks[link]);
				if (lobj == null) continue;
				if (lobj.id != rm.memory.library["link"] && lobj.cooldown == 0 && lobj.energy > 0 && libLink.energy != libLink.energyCapacity) {
					console.log(link + " link transferring to library link");
					lobj.transferEnergy(libLink);
				}
			}
		}
		
		for (var cname in mem.freeDrones) {
			var creep = Game.creeps[cname];
			if (creep == undefined || creep.spawning || mem.assignFreeDrones == false) continue;
			if (rm.memory.library != undefined && rm.memory.library["use"] == true) {
				creep.memory.dropoff = rm.memory.library["primary"];
			} else {
				creep.memory.dropoff = this.spawn.id;
			}
			switch (mem.freeDrones[cname]) {
				case "harvester":
					var chosenSource = undefined;
					var sourceName = "";
					for (var source in rm.memory.freeEnergy) {
						if (source == undefined) continue;
						if (rm.memory.freeEnergy[source] > 0) {
							chosenSource = source;
							rm.memory.freeEnergy[source] -= 1;
							sourceName = "energy ball";
							break;
						}
					}
					if (chosenSource == undefined) {
						for (var source in mem.dronesAtSources) {
							if (mem.dronesAtSources[source] > 0) {
								chosenSource = source;
								mem.dronesAtSources[source] -= 1;
								sourceName = "energy mine";
								break;
							}
						}
					}
					if (chosenSource == undefined) break;
					creep.memory.task = "getEnergy";
					creep.memory.target = chosenSource;
					delete mem.freeDrones[cname];
					console.log("Sending " + creep.name + " to " + sourceName);
				break;

				case "farHarvester":
					var chosenRoom = undefined;
					for (var room in mem.roomsCovered) {
						if (mem.roomsCovered[room] > 0) {
							chosenRoom = room;
							mem.roomsCovered[room] -= 1;
							break;
						}
					}
					if (chosenRoom == undefined) break;
					creep.memory.task = "getFarEnergy";
					creep.memory.target = chosenRoom;
					creep.memory.dropoff = this.spawn.room.name;
					creep.memory.linkTarget = mem.roomLinks[chosenRoom];
					delete mem.freeDrones[cname];
					console.log("Sending " + creep.name + " to room " + chosenRoom + " to energy mine");
				break;

				case "builder":
					if (mem.noBuilding == 1) break;
					var site = undefined;
					for (var rs in rm.memory.repairStructs) {
						site = Game.getObjectById(rs);
						break;
					}
					if (site != undefined) {
						delete rm.memory.repairStructs[site.id];
						creep.memory.task = "repairSite";
						creep.memory.target = site.id;
						delete mem.freeDrones[cname];
						console.log("Sending " + creep.name +" to repair a site");
						break;
					}
					site = this.getWorkSite(creep);
					if (site != undefined) {
						var siteName = "construction site";
						if (site.progress == undefined)
							siteName = "up walls";
						creep.memory.task = "buildSite";
						creep.memory.target = site.id;
						delete mem.freeDrones[cname];
						console.log("Sending " + creep.name + " to build " + siteName);
						break;
					}
					if (mem.distantBuilder > 0) {
						mem.distantBuilder -= 1;
						creep.memory.task = "buildFarSite";
						creep.memory.target = "W1N4";
						delete mem.freeDrones[cname];
						console.log("Sending " + creep.name + " to far builder");
						break;
					}/* else {
						creep.memory.task = "transferToFarRCL";
						creep.memory.target = "W1N4";
						delete mem.freeDrones[cname];
						console.log("Sending " + creep.name + " to far room controller");
					}*/
				break;
				
				case "controllerKeeper":
					if (mem.noBuilding == 1) break;
					creep.memory.task = "transferToRCL";
					creep.memory.target = rm.controller.id;
					delete mem.freeDrones[cname];
					console.log("Sending " + creep.name + " to room controller");
					break;
				break;

				case "librarian":
					creep.memory.task = "manageLibrary";
					creep.memory.dropoff = null;
					creep.memory.target = rm.memory.library["primary"];
					delete mem.freeDrones[cname];
					console.log("Sending " + creep.name + " to manage library");
				break;

				case "melee":
				case "healer":
				case "ranged":
					creep.memory.task = "undraftedArmy";
					creep.memory.self = creep.id;
					var shorthand = creep.memory.role.substring(0, 1);
					Memory.army.freeUnits[shorthand].push(creep.id);
					Memory.army.droneNeedsFilled[shorthand] -= 1;
					mem.droneCount -= 1;
					mem.totalDrones[shorthand] -= 1;
					delete mem.freeDrones[cname];
				break;
			}
		}
	},
	roomMaintenance: function() {
		var rm = this.spawn.room;
		
		var droppedEnergy = rm.find(FIND_DROPPED_ENERGY);
		for (var en in droppedEnergy) {
			if (rm.memory.freeEnergy[droppedEnergy[en].id] == undefined && droppedEnergy[en].energy > 50) {
				rm.memory.freeEnergy[droppedEnergy[en].id] = 1;
			}
		}
		for (var en in rm.memory.freeEnergy) {
			if (Game.getObjectById(en) == null || Game.getObjectById(en).energy == 0) {
				delete rm.memory.freeEnergy[en];
			}
		}

		if (Memory.army != undefined) {
			var enemies = rm.find(FIND_HOSTILE_CREEPS);
			Memory.army.localEnemies = {};
			var cnt = 0;
			for (var enemy in enemies) {
				Game.notify("Hostile detected in room " + enemy.room.name + " with id " + enemy.id + " owned by " + enemy.owner);
				console.log("Hostile detected in room " + enemy.room.name + " with id " + enemy.id + " owned by " + enemy.owner);
				Memory.army.localEnemies[enemies[enemy].id] = 1;
				cnt++;
			}
			Memory.army.localEnemyCount = cnt;
			if (cnt > 0 && Memory.army.taskForces["Defense"] != undefined && Memory.army.taskForces["Defense"].activeOrders == false) {
				Memory.army.taskForces["Defense"].desiredBuild = {"r": cnt*2};
				Memory.army.taskForces["Defense"].activeOrders = true;
			}
		}
		
		if (rm.controller.my && rm.memory.timer <= 0) {
			rm.memory.energy = 0;
			rm.memory.energyMax = 0;
			rm.memory.builtWalls = {};
			rm.memory.constructedWalls = {};
			rm.memory.repairStructs = {};
			var newExtension = false;
			for (var s in rm.memory.roads) {
				rm.memory.roads[s] = 0;
			}
			for (var s in rm.memory.ramparts) {
				rm.memory.ramparts[s] = 0;
			}
			
			var structs = rm.find(FIND_STRUCTURES);
			for (var struct in structs) {
				if (structs[struct].progress != undefined) continue;
				var t = structs[struct].structureType;
				if (structs[struct].my) {
					if (t == "spawn" || t == "extension") {
						rm.memory.energy += structs[struct].energy;
						rm.memory.energyMax += structs[struct].energyCapacity;
					}
					if (t == "extension" && rm.memory.extensions[structs[struct].id] == undefined) {
						rm.memory.extensions[structs[struct].id] = 1;
						newExtension = true;
					}
					if (t == "rampart") {
						var posStr = structs[struct].pos.x + ";" + structs[struct].pos.y;
						rm.memory.ramparts[posStr] = 1;
					}
				} else if (t == "road") {
					var posStr = structs[struct].pos.x + ";" + structs[struct].pos.y;
					rm.memory.roads[posStr] = 1;
				}
				if (t == "rampart") {
					rm.memory.builtWalls[structs[struct].id] = 1;
				} else if (t == "constructedWall") {
					rm.memory.constructedWalls[structs[struct].id] = 1;
				} else if (structs[struct].owner == undefined && structs[struct].hits < structs[struct].hitsMax * .5) {
					rm.memory.repairStructs[structs[struct].id] = 1;
				}
			}
			
			for (var s in rm.memory.roads) {
				if (rm.memory.roads[s] == 0) {
					var p = s.split(";");
					//console.log("Rebuilding road at " + p[0] + ", " + p[1]);
					rm.getPositionAt(p[0], p[1]).createConstructionSite("road");
				}
			}
			for (var s in rm.memory.ramparts) {
				if (rm.memory.ramparts[s] == 0) {
					var p = s.split(";");
					//console.log("Rebuilding rampart at " + p[0] + ", " + p[1]);
					rm.getPositionAt(p[0], p[1]).createConstructionSite("rampart");
				}
			}
			if (newExtension) {
				var newExt = [];
				for (var ext in rm.memory.extensions) {
					var pathLength = this.spawn.pos.findPathTo(Game.getObjectById(ext)).length;
					newExt.push([pathLength, ext]);
				}
				newExt.sort(function(a, b){ return a[0]-b[0] });
				rm.memory.extensions = {};
				for (var i in newExt) {
					rm.memory.extensions[newExt[i][1]] = 1;
				}
			}
			rm.memory.timer = 10;
		}
		rm.memory.timer -= 1;
	}
};
main.cleanup();
main.flagMaintenance();
main.setupArmy();
for (var rm in Memory.roomsInUse) {
	var spn = Memory.roomsInUse[rm];
	if (spn != "tmp") {
		main.spawnName = spn;
		main.setupSpawn();
	}
	main.creeps(rm);
	if (spn != "tmp") {
		//console.log(rm + ":" + (Game.getUsedCpu() - cpu1).toFixed(2));
		//var cpu1 = Game.getUsedCpu();
		main.roomMaintenance();
		main.spawner();
	}
}
main.taskForceMaintenance();