import { create } from "domain";
import { useEffect, useState } from "react";
import { Shift } from "./ShiftList";

const ShiftCreateButton : React.FC<{
    email: string
    create: (shift: Shift) => void
}> = (props) => {

    const { email, create } = props;
    const [ location, setLocaiton ] = useState<{lat: Number, lng: Number}>(
        {lat: 0, lng: 0}
    );

    const geolocation = () => {
        navigator.geolocation.getCurrentPosition(g => setLocaiton(
            {lat: g.coords.latitude, lng: g.coords.longitude}
        ))
    }

    useEffect(() => {
        geolocation();
    }, [])


    const createShift = async (): Promise<void> => {
        await fetch('/api/shift', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                lat: location.lat,
                lng: location.lng
            })
        })
        .then(res => res.json())
        .then(res => res as Shift)
        .then(create)
        .catch(console.error);
    }

    return <button style={{ 'color': 'greem' }} onClick={ () => createShift() }>Open Shift</button>
}

export default ShiftCreateButton;