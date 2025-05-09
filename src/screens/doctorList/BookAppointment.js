import React, { useState, useEffect } from "react";
import { FormControl, Grid, TextField, Button, Typography } from "@material-ui/core";
import SelectField from "../../common/form/SelectField";
import { KeyboardDatePicker } from '@material-ui/pickers';
import moment from "moment";
import { getDoctorAvailableTimeSlot, bookAppointment, getUserDetails } from "../../common/utils/HttpConnector";

const BookAppointment = (props) => {
    const { doctorDetails } = props;
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [appointmentDate, setAppointmentDate] = useState(moment());
    const [doctorTimeSlots, setDoctorAvailableTimeSlots] = useState([]);
    const [isTimeSlotNull, setTimeSlotNull] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const handleDateSelection = (date) => {
        setAppointmentDate(date);
    };

    const handleTimeSlotSelection = (e) => {
        setSelectedTimeSlot(e.target.value);
        setTimeSlotNull(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const timeSlotData = await getDoctorAvailableTimeSlot(doctorDetails.id, moment(appointmentDate).format("YYYY-MM-DD"));
                setDoctorAvailableTimeSlots(timeSlotData.timeSlot);
            } catch (error) {
                console.log("Error fetching time slots:", error);
                setErrorMessage("Failed to fetch available time slots. Please try again later.");
            }

            try {
                const userData = await getUserDetails();
                setUserDetails(userData);
            } catch (error) {
                console.log("Error fetching user details:", error);
                setErrorMessage("Failed to fetch user details. Please ensure you're logged in.");
            }
        };
        fetchData();
    }, [doctorDetails.id, appointmentDate]); // Added doctorDetails.id and appointmentDate as dependencies

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const timeSlot = form["timeSlot"].value;
        const priorMedicalHistory = form["priorMedicalHistory"].value || "NA";
        const symptoms = form["symptoms"].value || "NA";
        const doctorName = form["doctorName"].value || "";

        if (!timeSlot) {
            setTimeSlotNull(true);
            return;
        }

        const formData = {
            doctorId: doctorDetails.id,
            doctorName,
            userId: userDetails.emailId,
            userName: userDetails.firstName,
            userEmailId: userDetails.emailId,
            timeSlot,
            appointmentDate: moment(appointmentDate).format("YYYY-MM-DD"),
            symptoms,
            priorMedicalHistory
        };

        bookAppointment(formData)
            .then(response => {
                if (response) {
                    alert("Booking Successful");
                    props.closePopup();
                } else {
                    alert("Either the slot is already booked or not available");
                }
            })
            .catch(e => {
                console.log("Error booking appointment:", e);
                setErrorMessage("Failed to book appointment. Please try again later.");
            });
    };

    return (
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <Grid item xs>
                <FormControl>
                    <TextField 
                        disabled
                        id="doctor_name" 
                        defaultValue={`${doctorDetails.firstName} ${doctorDetails.lastName}`}
                        label="Doctor Name"
                        variant="standard" 
                        required
                        name="doctorName"
                    />
                    <KeyboardDatePicker
                        autoOk={true}
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="appointment-date-inline"
                        label="Appointment Date"
                        value={appointmentDate} 
                        onChange={handleDateSelection}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        minDate={moment()} 
                        name="appointmentDate"      
                    />
                    <SelectField 
                        menudata={doctorTimeSlots} 
                        handleSelection={handleTimeSlotSelection} 
                        selectedValue={selectedTimeSlot}
                        variant="standard"
                        label="TimeSlot"
                        name="timeSlot"
                    />
                    {isTimeSlotNull && 
                        <Typography color="error">
                            Select a time slot
                        </Typography>
                    }
                    <TextField
                        id="medical-history-multiline"
                        label="Medical History"
                        multiline
                        minRows={4}
                        defaultValue=""
                        name="priorMedicalHistory"
                    />
                    <TextField
                        id="symptoms-multiline"
                        label="Symptoms"
                        multiline
                        minRows={4}
                        defaultValue=""
                        name="symptoms"
                    />
                    {errorMessage && 
                        <Typography color="error">
                            {errorMessage}
                        </Typography>
                    }
                    <br />
                    <br />
                    <Button variant="contained" color="primary" type="submit">
                        Book Appointment
                    </Button>
                </FormControl>
            </Grid>
        </form>
    );
};

export default BookAppointment;
