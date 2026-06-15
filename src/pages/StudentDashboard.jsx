

function StudentDashboard() {

    const username =
        localStorage.getItem("username");

    return (
        <div className="container mt-4">

            <h2>Student Dashboard</h2>

            <h5>
                Welcome, {username}
            </h5>

            <div className="row mt-4">

                <div className="col-md-6">
                    <div className="card p-3">
                        <h5>Attendance</h5>
                        <p>View attendance records.</p>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-3">
                        <h5>Marks</h5>
                        <p>View academic performance.</p>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default StudentDashboard;