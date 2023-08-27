import Main from "./main";
import {
  Routes,
  Route
} from "react-router-dom";

const Station = () => {
	return (
		<Routes>
	        <Route path="/:station_id" element={<Main />} />
	    </Routes>
	)
}

export default Station;