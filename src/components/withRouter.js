import { useNavigate, useParams } from 'react-router-dom';

const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    const params = useParams();

    const nav = (v) => {
      navigate(v);
      setTimeout(() => {
        window.location.reload();
      }, 200)
    }
    
    return (
      <Component
        {...props}
        navigate={nav}
        params={params}        
       />
    );
  };
  
  return Wrapper;
};

export default withRouter;