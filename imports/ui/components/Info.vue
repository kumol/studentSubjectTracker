<template>
  <div>
    <div class="menuBar">
      <ul class="nav-style">
        <li><button class="button" @click="select('stForm')">Add Student</button></li>
        <li><button class="button" @click="select('stList')">Student List</button></li>
        <li><button class="button" @click="select('sbForm')">Add Subject</button></li>
        <li><button class="button" @click="select('sbList')">Subject List</button></li>
        <li><button class="button" @click="select('asSubject')">subjectAssign</button></li>
      </ul>
    </div>
    <div v-show="stForm">
        <form class="info-link-add">
          <input type="text" v-model="name" name="name" placeholder="Name" required>
          <input type="text" v-model="email" name="email" placeholder="Email" required>
          <input type="text" v-model="phone" name="phone" placeholder="Phone Number">
          <input type="date" v-model="birthDate" name="birthDate" placeholder="Birth Date">
          <input type="submit" name="submit" @click="addStudent($event)" value="Add new Student">
        </form>
    </div>
    <div v-show="stList">
       <table>
        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Date of birth</th>
          <th>Subjects</th>
        </thead>
        <tr v-for="student in students" :key="student._id">
          <td>{{student.name}}</td>
          <td>{{student.email}}</td>
          <td>{{student.phone}}</td>
          <td>{{student.birthDate}}</td>
          <td>{{showData(student)}}</td>
        </tr>
      </table>
    </div>
    <div v-show="sbForm">
      <form class="info-link-add">
          <input type="text" v-model="title" name="title" placeholder="title" required>
          <input type="submit" name="submit" @click="addSubject($event)" value="Add new Student">
        </form>
    </div>
    <div v-show="sbList">
      <table>
        <thead>
          <th>Title</th>
          <th>Students</th>
          
        </thead>
        <tr v-for="subject in subjects" :key="subject.title">
          <td>
            {{subject.title}}
          </td>
        </tr>
      </table>
    </div>

    <div v-show="asSubject">
      <table v-show="hideList">
        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Date of birth</th>
          <th>Subjects</th>
          <th>AsignSubject</th>
        </thead>
        <tr v-for="student in students" :key="student._id">
          <td>{{student.name}}</td>
          <td>{{student.email}}</td>
          <td>{{student.phone}}</td>
          <td>{{student.birthDate}}</td>
          <td>{{student.birthDate}}</td>
          <td><button @click="asignSubject(student)">assign Subject</button></td>
        </tr>
      </table>

      <div>
        <table>
          <thead>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Subjects</th>
          </thead>
          <tr>
            <td>{{selectedStudent.name}}</td>
            <td>{{selectedStudent.email}}</td>
            <td>{{selectedStudent.phone}}</td>
            <td>{{selectedSubjectList()}}</td>
          </tr>
      </table>

      <ul>
          <li v-for="subject in subjects" :key="subject.title"><button @click="allocSub(subject)">{{subject.title}}</button></li>
      </ul>

      <button @click="saveAllocatedSubjects()">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import Students from '../../api/collections/Students'
import Subjects from "../../api/collections/Subjects"
export default {
  data() {
    return {
      hideList:true,
      stForm:true,
      stList:false,
      sbForm:false,
      sbList:false,
      asSubject:false,
      name: "",
      email: "",
      phone: "",
      birthDate: null,
      title: "",
      selectedStudent:{},
      subjectList:[],
      subjectListId:[],
    }
  },
  meteor: {
    $subscribe: {
      'students': [],
      'subjects':[]
    },
    students () {
      return Students.find({})
    },
    subjects(){
      return Subjects.find({});
    }
  },
  methods: {
    selectedSubjectList(){
      if(this.subjectList){
        return this.subjectList.map(x=>{return x.title}).toString()
      }
      return ""
    },
    showData(student){
      let val;
      if(student.subjects){
        val = student.subjects.map(s=>{return s.title}).toString();
        console.log(val)
      }
      return val;
    },
    allocSub(sub){
      let subject = this.subjectList.find(s=>{return s._id == sub._id});
      if(!subject){
        this.subjectList.push(sub);
      }
    },
    asignSubject(student){
      console.log(student);
      //this.hideList = false;
      this.selectedStudent = student;
      this.subjectList = student.subjects ? student.subjects : [];
    },
    saveAllocatedSubjects(){
      event.preventDefault()
      Meteor.call('updateStudent',this.selectedStudent._id,this.subjectList,(error)=>{
        if(error){
          alert(error);
        }else{
          this.subjectList=null
          console.log("success"+ this.subjectList);
        }
      })
    }
    ,
    addSubject(event){
      event.preventDefault()
      Meteor.call('createSubject',this.title,(error)=>{
        if(error){
          alert(error);
        }else{
          this.title="",
          console.log("success")
        }
      })
    },
    addStudent(event){
      event.preventDefault()
      Meteor.call('createStudent', this.name, this.email, this.phone, this.birthDate, (error) => {
        if (error) {
          alert(error.error)
        } else {
          console.log("success");
          this.name = ''
          this.email = ''
          this.phone = '',
          this.birthDate =null
        }
      })
    },
     select(id){
      switch(id){
        case "stForm":
          this.stForm = true,
          this.stList=false,
          this.sbForm=false,
          this.sbList=false,
          this.asSubject=false
          break
        case "stList":
          this.stForm = false,
          this.stList=true,
          this.sbForm=false,
          this.sbList=false,
          this.asSubject=false
          break
        case "sbForm":
          this.stForm = false,
          this.stList=false,
          this.sbForm=true,
          this.sbList=false,
          this.asSubject=false
          break
        case "sbList":
          this.stForm = false,
          this.stList=false,
          this.sbForm=false,
          this.sbList=true,
          this.asSubject=false
          break
        case "asSubject":
          this.stForm = false,
          this.stList=false,
          this.sbForm=false,
          this.sbList=false,
          this.asSubject=true
          break
      }
    }
  },
 
}
</script>

<style scoped>
  ul {
    font-family: monospace;
  }
  .nav-style{
    list-style: none;
    display: inline-flex !important;
  }
  .button{
    margin-right: 20px;
    padding: 10px 20px;
  }
</style>
