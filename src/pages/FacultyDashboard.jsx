

function FacultyDashboard() {
    return (
        <div className="container mt-4">
            <h2>Faculty Dashboard</h2>

            <div className="row">

                <div className="col-md-4">
                    <div className="card p-3">
                        <h5>Attendance Management</h5>
                        <p>Manage student attendance.</p>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card p-3">
                        <h5>Marks Entry</h5>
                        <p>Enter student marks.</p>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card p-3">
                        <h5>Student List</h5>
                        <p>View students.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default FacultyDashboard;