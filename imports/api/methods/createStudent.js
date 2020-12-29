import {Meteor } from "meteor/meteor";

import Students from "../collections/Students";

Meteor.methods({
    "createStudent"(name,email,phone,birthDate){
        return Students.insert({
            name,
            email,
            phone,
            birthDate
        })
    },
    "updateStudent"(_id,list){
        return Students.update(_id,{
            $set: { subjects: list }
        })
    }
})