import { AppBar, Toolbar, Typography } from "@mui/material";

function Header(props) {
    return (
        <AppBar position="sticky">
            <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h6">{props.title}</Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Header;