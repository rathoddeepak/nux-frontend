import Main from "./main";
import {
  Routes,
  Route
} from "react-router-dom";

const Framer = () => {
	return (
		<Routes>
	        <Route path="/:stream_id" element={<Main />} />
	    </Routes>
	)
}

export default Framer;