import React from "react";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    rating: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        '& > * + *': {
            marginLeft: 8,
        },
    },
    errorText: {
        color: 'red',
        marginTop: '10px',
    },
});

const DoctorDetails = (props) => {
    const { doctorDetails } = props;
    const classes = useStyles();

    // Error handling: if doctorDetails is missing or incomplete, display an error message.
    if (!doctorDetails || !doctorDetails.id) {
        return (
            <Grid item xs>
                <Typography gutterBottom variant="body1" component="p" className={classes.errorText}>
                    Error: Doctor details are unavailable.
                </Typography>
            </Grid>
        );
    }

    const { firstName, lastName, totalYearsOfExp, speciality, dob, address, emailId, mobile, rating } = doctorDetails;

    return (
        <Grid item xs key={doctorDetails.id}>
            <>
                <Typography gutterBottom variant="body1" component="p">
                    {`Dr. ${firstName} ${lastName}`}
                </Typography>
                <Typography variant="body2" component="p">
                    {`Total Experience: ${totalYearsOfExp || 'N/A'}`}
                </Typography>
                <Typography variant="body2" component="p">
                    {`Speciality: ${speciality || 'N/A'}`}
                </Typography>
                <Typography variant="body2" component="p">
                    {`Date of Birth: ${dob || 'N/A'}`}
                </Typography>
                <Typography variant="body2" component="p">
                    {`City: ${address?.city || 'N/A'}`}
                </Typography>
                <Typography variant="body2" component="p">
                    {`Email: ${emailId || 'N/A'}`}
                </Typography>
                <Typography variant="body2" component="p">
                    {`Mobile: ${mobile || 'N/A'}`}
                </Typography>
                <div className={classes.rating}>
                    <Typography component="p" variant="body2">
                        Rating:
                    </Typography>
                    <Rating
                        name="rating"
                        defaultValue={rating || 0}
                        precision={0.5}
                        readOnly
                        size="small"
                    />
                </div>
            </>
        </Grid>
    );
};

export default DoctorDetails;
