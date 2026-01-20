// // IMPORTS
// import Card from "@mui/material/Card";
// import Typography from "@mui/material/Typography";
// import Grid from "@mui/material/Grid";
// import Avatar from "@mui/material/Avatar";
// import Badge from "@mui/material/Badge";
// import Button from "@mui/material/Button";

// // STYLES
// const styles = {
//   details: {
//     padding: "1rem",
//     borderTop: "1px solid #e1e1e1"
//   },
//   value: {
//     padding: "1rem 2rem",
//     borderTop: "1px solid #e1e1e1",
//     color: "#899499"
//   }
// };

// //APP
// export default function ProfileCard(props: any) {
//   return (
//     <Card variant="outlined">
//       <Grid
//         container
//         direction="column"
//         justifyContent="center"
//         alignItems="center"
//       >
//         {/* CARD HEADER START */}
//         <Grid sx={{ p: "1.5rem 0rem", textAlign: "center" }}>
//           {/* PROFILE PHOTO */}
//           <Badge
//             overlap="circular"
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           >
//             <Avatar
//               sx={{ width: 100, height: 100, mb: 1.5 }}
//               src="https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/pass/best-face-oil.png"
//             ></Avatar>
//           </Badge>

//           {/* DESCRIPTION */}
//           <Typography variant="h6">{props.name}</Typography>
//           <Typography color="text.secondary">{props.sub}</Typography>
//         </Grid>
//         {/* CARD HEADER END */}

//         {/* DETAILS */}
//         <Grid container>
//           <Grid size={6}>
//             <Typography style={styles.details}>Detail 1</Typography>
//             <Typography style={styles.details}>Detail 2</Typography>
//             <Typography style={styles.details}>Detail 3</Typography>
//           </Grid>
//           {/* VALUES */}
//           <Grid size={6} sx={{ textAlign: "end" }}>
//             <Typography style={styles.value}>{props.dt1}</Typography>
//             <Typography style={styles.value}>{props.dt2}</Typography>
//             <Typography style={styles.value}>{props.dt3}</Typography>
//           </Grid>
//         </Grid>

//         {/* BUTTON */}
//         <Grid style={styles.details} sx={{ width: "100%" }}>
//           <Button
//             variant="contained"
//             color="secondary"
//             sx={{ width: "99%", p: 1, my: 2 }}
//           >
//             View Public Profile
//           </Button>
//         </Grid>
//       </Grid>
//     </Card>
//   );
// }
