import React, { useState, useEffect, useContext } from "react";
import Typography from '@material-ui/core/Typography';
import { getDoctors, getSpeciality } from "../../common/utils/HttpConnector";
import DoctorTile from "./DoctorTile";
import SelectField from "../../common/form/SelectField";
import { makeStyles } from '@material-ui/core/styles';
import { MyContext } from "../Controller";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        marginTop: '20px',
    },
});

const DoctorList = (props) => {
    const classes = useStyles();
    const [doctorsList, setDoctorsList] = useState([]);
    const [specialistMenuData, setSpecialistMenuData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [error, setError] = useState(null); // State to store errors
    const { isAuthenticated, showPopup } = useContext(MyContext);

    // Fetch doctors when selectedFilter changes
    useEffect(() => {
        const filter = { speciality: selectedFilter };
        setError(null); // Reset error before each request
        getDoctors(filter)
            .then((response) => {
                if (response && Array.isArray(response)) {
                    setDoctorsList(response);
                } else {
                    setError("No doctors found for the selected speciality.");
                }
            })
            .catch((err) => {
                setError("Failed to fetch doctors. Please try again later.");
                console.log(err);
            });
    }, [selectedFilter]);

    // Fetch speciality options on component mount
    useEffect(() => {
        setError(null); // Reset error before each request
        getSpeciality()
            .then((response) => {
                if (response && Array.isArray(response)) {
                    setSpecialistMenuData(response);
                } else {
                    setError("Failed to fetch speciality options. Please try again later.");
                }
            })
            .catch((err) => {
                setError("Failed to fetch speciality options. Please try again later.");
                console.log(err);
            });
    }, []);

    return (
        <Grid 
            container
            alignItems="center"
            direction="column"
            justifyContent="space-evenly"
            className={classes.root}
        >
            <Typography gutterBottom variant="body1" component="p">
                Select Speciality:
            </Typography>
            <SelectField
                menudata={specialistMenuData}
                handleSelection={(e) => setSelectedFilter(e.target.value)}
                selectedValue={selectedFilter}
                variant="filled"
            />
            
            {error && (
                <Typography color="error">{error}</Typography>
            )}

            {doctorsList.length > 0 ? (
                doctorsList.map((doctor, index) => (
                    <DoctorTile
                        doctorData={doctor}
                        key={`doctor_tile_${index}`}
                        {...props}
                        isAuthenticated={isAuthenticated}
                        showPopup={showPopup}
                    />
                ))
            ) : (
                !error && (
                    <Typography>No doctors available for the selected speciality.</Typography>
                )
            )}
        </Grid>
    );
};

export default DoctorList;
