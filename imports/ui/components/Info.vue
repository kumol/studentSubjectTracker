<template>
  <div>
    <div class="menuBar">
      <ul class="nav-style">
        <li><button class="button" @click="select('stForm')">Add Student</button></li>
        <li><button class="button" @click="select('stList')">Student List</button></li>
        <li><button class="button" @click="select('sbForm')">Add Subject</button></li>
        <li><button class="button" @click="select('sbList')">Subject List</button></li>
        <li><button class="button" @click="select('asignSubject')">subjectAssign</button></li>
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
      <li v-for="student in students" :key="student.name">{{student.name}}</li>
    </div>
    <div v-show="sbForm">
      <form class="info-link-add">
          <input type="text" v-model="title" name="title" placeholder="title" required>
          <input type="submit" name="submit" @click="addSubject($event)" value="Add new Student">
        </form>
    </div>
  </div>
</template>

<script>
import Students from '../../api/collections/Students'
import Subjects from "../../api/collections/Subjects"
export default {
  data() {
    return {
      stForm:true,
      stList:false,
      sbForm:false,
      sbList:false,
      asignSubject:false,
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
    addSubject(event){

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
          this.asignSubject=false
          break
        case "stList":
          this.stForm = false,
          this.stList=true,
          this.sbForm=false,
          this.sbList=false,
          this.asignSubject=false
          break
        case "sbForm":
          this.stForm = false,
          this.stList=false,
          this.sbForm=true,
          this.sbList=false,
          this.asignSubject=false
          break
        case "sbList":
          this.stForm = false,
          this.stList=false,
          this.sbForm=false,
          this.sbList=true,
          this.asignSubject=false
          break
        case "assignSubject":
          this.stForm = false,
          this.stList=false,
          this.sbForm=false,
          this.sbList=false,
          this.asignSubject=true
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
