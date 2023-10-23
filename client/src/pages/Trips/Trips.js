import React from "react"
import "./Trips.css"
import CustomizedTable from "../../components/CustomizedTable/CustomizedTable";
import WebpageBackground from "../../components/WebpageBackground/WebpageBackground";

function Trips () {
    const columns = ["ID", "Giờ", "Trạng thái"]
    const data = [
        {id: 1, time: "14h - 16h", status: "Mở"},
        {id: 2, time: "14h - 16h", status: "Mở"},
        {id: 3, time: "14h - 16h", status: "Mở"},
        {id: 4, time: "14h - 16h", status: "Mở"},
        {id: 5, time: "14h - 16h", status: "Mở"},
        {id: 6, time: "14h - 16h", status: "Mở"},
        {id: 7, time: "14h - 16h", status: "Mở"},
        {id: 8, time: "14h - 16h", status: "Mở"},
        {id: 9, time: "14h - 16h", status: "Mở"},
        {id: 10, time: "14h - 16h", status: "Mở"},
        {id: 11, time: "14h - 16h", status: "Mở"},
        {id: 12, time: "14h - 16h", status: "Mở"},
        {id: 13, time: "14h - 16h", status: "Mở"},
    ];
    return (
        <WebpageBackground>
            <div className="table-wrapper">
                <div className="table-title">Lịch Xe</div>
                <CustomizedTable data={data} columns={columns}/>
            </div>
        </WebpageBackground>
    )
}
export default Trips