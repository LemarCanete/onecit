import React from 'react'

const Appointment = ({data}) => {
    console.log(data)
    return (
        <tr className=''>
            <td className="">{data.from.firstname} {data.from.lastname}</td>
            <td className="">{data.phonenumber}</td>
            <td className="">{data.reason}</td>
            <td className="">{data.reason}</td>
            <td className="">{data.reason}</td>
            <td className="">{data.reason}</td>
        </tr>
    )
}

export default Appointment