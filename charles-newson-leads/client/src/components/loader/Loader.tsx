import Spinner from 'react-bootstrap/Spinner';

function Loader() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        }} className='h-[80vh]'>
            <Spinner animation="border" role="status" variant='primary'>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}

export default Loader;