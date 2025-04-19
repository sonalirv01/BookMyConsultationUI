import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "../Controller";
import { Paper, Typography, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { getUserAppointments } from "../../common/utils/HttpConnector";

const useStyles = makeStyles({
    paper: {
        textAlign: 'left',
        margin: '15px',
        padding: '20px',
        cursor: 'pointer'
    }
});

const Appointment = (props) => { 
    const context = useContext(MyContext);
    
    // If user is not authenticated, show a message asking them to log in
    if (!context.isAuthenticated) {
        return (
            <div>
                <Typography variant="body1" component="p" >
                    Login to see appointments
                </Typography>
            </div>
        );
    }

    // If authenticated, show the list of appointments
    return <AppointmentList {...context} />;
}

const AppointmentList = (props) => {
    const [userAppointmentList, setUserAppointmentsList] = useState([]);
    const [error, setError] = useState(""); // To hold any error message
    const classes = useStyles();

    useEffect(() => {
        // Fetch appointments and handle errors if the request fails
        const fetchAppointments = async () => {
            try {
                const data = await getUserAppointments();
                if (data && Array.isArray(data)) {
                    setUserAppointmentsList(data);
                } else {
                    setError("Failed to fetch appointments. Please try again later.");
                }
            } catch (e) {
                console.error("Error fetching appointments:", e);
                setError("An error occurred while fetching appointments. Please try again later.");
            }
        };

        fetchAppointments();
    }, []); // Empty dependency array means this runs once when the component mounts

    // Display a loading message if no appointments are loaded yet, or show an error message
    if (error) {
        return (
            <div>
                <Typography variant="body1" color="error" component="p">
                    {error}
                </Typography>
            </div>
        );
    }

    return (
        <div>
            {/* If no appointments exist */}
            {userAppointmentList.length === 0 ? (
                <Typography variant="body1" component="p">
                    You have no appointments.
                </Typography>
            ) : (
                userAppointmentList.map((appointment, index) => {
                    const appointmentRatingData = {
                        appointmentId: appointment.appointmentId,
                        doctorId: appointment.doctorId
                    };
                    return (
                        <Paper className={classes.paper} key={`appointment_${appointment.appointmentId}`}>
                            <Typography gutterBottom variant="body1" component="p">
                                {appointment.doctorName}
                            </Typography>
                            <Typography gutterBottom variant="body2" component="p">
                                {`Date: ${appointment.appointmentDate}`}
                            </Typography>
                            <Typography gutterBottom variant="body2" component="p">
                                {`Symptoms: ${appointment.symptoms}`}
                            </Typography>
                            <Typography gutterBottom variant="body2" component="p">
                                {`Prior Medical History: ${appointment.priorMedicalHistory}`}
                            </Typography>
                            <br />
                            <br />
                            <Button 
                                variant='contained' 
                                color="primary"  
                                onClick={() => props.showPopup("AppointmentRating", appointmentRatingData)}
                            >
                                Rate Appointment
                            </Button>
                        </Paper>
                    );
                })
            )}
        </div>
    );
}

export default Appointment;
