import React, { useState } from "react"
import { Button } from "react-bootstrap"

function CheckboxList (props) {
    const {UnselectedItem, SelectedItem, data, selectedData,} = props
    return (
        <div>
            <div>
                <div>Selected:</div>
                {selectedData?.map((d) => 
                <SelectedItem item={d}/>)}
            </div>
            <div>
                <div>Remaining Drivers:</div>
                {data?.map((d) => 
                <UnselectedItem item={d}/>)}
            </div>
        </div>
    )
}
export default CheckboxList