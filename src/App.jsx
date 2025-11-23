import { useState } from "react";
import "./App.css";



function App() {

  const [values, setValues] = useState({
    fullname: "",
    emailadd: "",
    eventname: "",
    region: "",
    rating: "",
    feedback: ""
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Form submitted:", values);
    alert("Thank you for your feedback!");
  };



    return(
      <div className="container">
        <h1>Event Feedback Form</h1>
        <h2>We welcome your input on the recent event to help us enhance future experiences.</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullname">Full name</label>

          <input type="text" placeholder="Enter Full Name" 
          onChange={(e) => handleChanges(e)}/>

          <label htmlFor="emailadd">Email Address</label>

          <input type="text" placeholder="Enter Email Address" 
          onChange={(e) => handleChanges(e)}/>

          <label htmlFor="region">Region</label>

          <select name="reg" id="reg" onChange={(e) => handleChanges(e)}>
            <option value="select">Select Region</option>
            <option value="Alsut">Alam Sutera</option>
            <option value="kmg">Kemanggisan</option>
            <option value="malang">Malang</option>
            <option value="bekasi">Bekasi</option>
          </select>

          <label htmlFor="eventname">Event Information</label>

          <input type="text" placeholder="Enter Event Name" 
          onChange={(e) => handleChanges(e)}/>

          <div className="rating-group">
            <label><input type="radio" name="rating" value="1" 
            onChange={(e) => handleChanges(e)}/> 😟 1 - Poor</label>
            <label><input type="radio" name="rating" value="2" 
            onChange={(e) => handleChanges(e)}/> 🙁 2 - Fair</label>
            <label><input type="radio" name="rating" value="3" 
            onChange={(e) => handleChanges(e)}/> 🙂 3 - Good</label>
            <label><input type="radio" name="rating" value="4" 
            onChange={(e) => handleChanges(e)}/> 😃 4 - Very Good</label>
            <label><input type="radio" name="rating" value="5" 
            onChange={(e) => handleChanges(e)}/> 😁 5 - Excellent</label>
          </div>



          <label htmlFor="feedback">Comment your feedback</label>

          <textarea name="feed" id="feed" cols="30" rows="10" 
          onChange={(e) => handleChanges(e)} placeholder="Enter Your Feedback Here"></textarea>
          <button type="submit">Sumbit</button>
        </form>
      </div>
    );
}

export default App;
