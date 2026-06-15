function Navbar() {

    const username =
        localStorage.getItem("username");

    return (
        <div
            style={{
                background: "#f8f9fa",
                padding: "15px"
            }}
        >
            <h4>
                Welcome {username}
            </h4>
        </div>
    );
}

export default Navbar;