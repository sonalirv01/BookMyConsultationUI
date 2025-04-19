import React, { useState } from "react";
import { TextField, FormControl, Grid, Typography, Button } from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import { rateAppointment } from "../../common/utils/HttpConnector";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '& > * + *': {
      marginLeft: theme.spacing(1),
    },
  },
}));

const RateAppointment = (props) => {
    const [rating, setRating] = useState(0);
    const [formRatingError, setFormRatingError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // For displaying API errors
    const classes = useStyles();

    const onRatingChanged = (value) => {
        setRating(value);
        setFormRatingError(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate rating
        if (rating === 0) {
            setFormRatingError(true);
            return;
        }

        const comment = e.target["comments"].value || "";
        const formData = {
            ...props.appointmentRatingData,
            rating,
            comment,
        };

        // API call to rate the appointment
        rateAppointment(formData)
            .then(() => {
                // Close the popup after successful submission
                props.closePopup();
            })
            .catch((error) => {
                // Handle error from the API request
                console.error("Error rating appointment:", error);
                setErrorMessage("An error occurred while submitting your rating. Please try again later.");
            });
    };

    return (
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <Grid item xs>
                <FormControl>
                    <TextField
                        id="rating-comments-multiline"
                        label="Comments"
                        multiline
                        minRows={4}
                        defaultValue=""
                        name="comments"
                    />
                    <br />
                    <div className={classes.root}>
                        <Typography component="p" variant="body1">
                            Rating:
                        </Typography>
                        <Rating
                            name="rating"
                            value={rating}
                            precision={0.5}
                            onChange={(event, newValue) => onRatingChanged(newValue)}
                        />
                    </div>
                    {formRatingError && (
                        <Typography color="error">
                            Please select a rating before submitting.
                        </Typography>
                    )}
                    {errorMessage && (
                        <Typography color="error">
                            {errorMessage}
                        </Typography>
                    )}
                    <br />
                    <Button variant="contained" color="primary" type="submit">
                        Rate Appointment
                    </Button>
                </FormControl>
            </Grid>
        </form>
    );
};

export default RateAppointment;
