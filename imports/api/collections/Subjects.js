import { Mongo } from 'meteor/mongo';
import Students from './Students';

export default new Mongo.Collection('Subjects',{schema:{
    title:{
        type:String
    },
    students:{
        type:[Students],
        optional:true
    }
}});