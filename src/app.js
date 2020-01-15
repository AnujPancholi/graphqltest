"use strict";


const config = require('./config.js');
const express = require('express');
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull,
	GraphQLInt,
	GraphQLList
} = require('graphql');
const expressGraphQL = require('express-graphql');

const staticData = require('../staticData/football.json');


const app = express();





const playerGQObject = new GraphQLObjectType({
	name: "player",
	description: "Football player info",
	fields: () => ({
		id: {
			type: GraphQLNonNull(GraphQLString)
		},
		name: {
			type: GraphQLNonNull(GraphQLString)
		},
		jersey_number: {
			type: GraphQLInt
		},
		positions: {
			type: new GraphQLList(GraphQLString)
		},
		team_id: {
			type: GraphQLString
		}
	})
})

const teamGQObject = new GraphQLObjectType({
	name: 'team',
	description: "Football team info",
	fields: () => ({
		id: {
			type: GraphQLNonNull(GraphQLString)
		},
		name: {
			type: GraphQLNonNull(GraphQLString)
		},
		league_titles: {
			type: GraphQLInt
		},
		players: {
			type: new GraphQLList(playerGQObject),
			resolve: (team) => staticData.players.filter(player => player.team_id===team.id) 
		}
	})
})



const RootQueryType = new GraphQLObjectType({
	name: "rootQueryType",
	description: "root query",
	fields: () => ({
		players: {
			type: new GraphQLList(playerGQObject),
			args: {
				team_id: {
					type: GraphQLString
				},
				id: {
					type: GraphQLString
				},
				jersey_number: {
					type: GraphQLInt
				},
				position: {
					type: GraphQLString
				}
			},
			resolve: (parent,args) => {
				let playersArr = staticData.players;
				if(args.team_id){
					playersArr = playersArr.filter(player => player.team_id===args.team_id);
				}
				if(args.id){
					playersArr = playersArr.filter(player => player.id===args.id);
				}
				if(args.jersey_number){
					playersArr = playersArr.filter(player => player.jersey_number===args.jersey_number);
				}
				return playersArr
			}
		},
		teams: {
			type: new GraphQLList(teamGQObject),
			resolve: () => staticData.teams
		}
	})
})




const myTestSchema = new GraphQLSchema({
	query: RootQueryType
})




app.use('/graphql',expressGraphQL({
	schema: myTestSchema,
	graphiql: true
}))



if(config.API_PORT){
	app.listen(config.API_PORT,() => {
		console.log(`GraphQL server listening on ${config.API_PORT}`);
	})
} else {
	console.error("FATAL ERROR: CANNOT START SERVER, API_PORT NOT DEFINED IN ENV");
	process.exit(1);
}