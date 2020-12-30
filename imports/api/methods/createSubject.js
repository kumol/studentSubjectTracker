import {Meteor } from "meteor/meteor";
import Subjects from "../collections/Subjects";

Meteor.methods({
    "createSubject"(title){
        return Subjects.insert({title});
    },
    "updateSubject"(_id,student){
        return Subjects.update({_id},{$push: { students: { student } }});
    },
    "deleteSubject"(id){
        return Subjects.remove({_id:id});
    },
    "removeStudentFromSubject"(id,student){
        return Subjects.update({_id:id},{
            $pull:{
                "students": student
              }
        })
    }
})