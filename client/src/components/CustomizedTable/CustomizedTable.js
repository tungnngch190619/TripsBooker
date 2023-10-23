import React, { useEffect, useState } from "react"
import { Button, Container, Table } from "react-bootstrap"
import "./CustomizedTable.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function CustomizedTable (props) {
    const {data, columns, options, tableTop} = props
    const [currentSegment, setCurrentSegment] = useState(1)
    const [segmentsNumber, setSegmentsNumber] = useState(null)

    function returnSegment () {
        let segment = []
        for(let i = (currentSegment -1 ) * 10; (i < data.length && i < currentSegment*10); i++) {
            let rowData = []
            Object.values(data[i]).forEach(element => {
                rowData.push((
                    typeof element === "boolean" ? 
                        element===true ? 
                        <td>
                            <div>
                                <Button disabled>
                                    <FontAwesomeIcon icon={"square-check"}/>
                                </Button>
                            </div>
                        </td> 
                        : 
                        <td>
                            <div>
                                <Button disabled>
                                    <FontAwesomeIcon icon={"square"}/>
                                </Button>
                            </div>
                        </td>
                    : 
                    <td>{element}</td>
                )
                )
            });
            if(options) {
                rowData.push(
                    <td>
                        {options(data[i])}
                    </td>
                )
            }
            segment.push(
            <tr>
                {rowData}
            </tr>)
        }
        return segment
    }

    const paginationNavigation  = () => {
        let content = []
        for (let i = 1; i <= segmentsNumber; i++) {
            content.push(
            <Button 
            className="pagination-nav-item text-black" 
            onClick={() => setCurrentSegment(i)}
            style={{backgroundColor: i == currentSegment ? "#4e73df" : "white"}}>{i}</Button>)
        }
        return (
            <div>
                <Button className="pagination-nav-item" onClick={() => currentSegment != 1 ? setCurrentSegment(currentSegment - 1): null}>
                    <FontAwesomeIcon icon={"angle-left"}></FontAwesomeIcon>
                </Button>
                {content}
                <Button className="pagination-nav-item" onClick={() => currentSegment != segmentsNumber ? setCurrentSegment(currentSegment + 1): null}>
                    <FontAwesomeIcon icon={"angle-right"}></FontAwesomeIcon>
                </Button>
            </div>
        )
    }

    useEffect(() => {
        const calcSegmentsNumber = () => {
            setSegmentsNumber(Math.ceil(data.length/10))
        }
        calcSegmentsNumber()
    }, [data])

    return (
        <div>
            {tableTop ? tableTop() : null}
            <Table hover>
                <thead table-hover>
                    <tr>
                        {columns.map((c) => <th>{c}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {returnSegment()}
                </tbody>
            </Table>
            <Container className="d-flex flex-row justify-content-between">
                <div>
                    {(currentSegment - 1) * 10 + 1} đến {currentSegment*10 > data.length ? data.length : currentSegment*10} trong tổng {data.length}
                    </div>
                {paginationNavigation()}
            </Container>
        </div>
    )
}
export default CustomizedTable