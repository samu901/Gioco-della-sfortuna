import '../assets/style/alert.css';

function Alert(props){
    return (
        <div className='alert' type={props.type}>{props.children}</div>
    )
}

export default Alert;