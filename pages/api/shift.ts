
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../src/prisma";


type Shift = {
    id: String
    user_id: String
    start: Date
    complete: Boolean
}

interface ShiftCreateRequest extends NextApiRequest {
    body: {
        email: string
        lat: number,
        lng: number
    }
}

interface ShiftCompleteRequest extends NextApiRequest {
    body: {
        id: string
    }
}

type Error = {
    message: string
}


const handler = async (req: ShiftCreateRequest & ShiftCompleteRequest, res: NextApiResponse<Shift | Shift[] | Error>) => {
    const { method } = req;

    if (method === "GET") {
        //waaaaaat
        const shifts = await prisma.shift.findMany();
        res.status(200).json(shifts);
    }

    if (method === "POST") {
        const { email, lat, lng } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            res.status(404).json({message: 'invalid user'})
        } else {
            const shift = await prisma.shift.findFirst({
                where: {
                    user_id: user.id,
                    complete: false,
                }
            })

            if(shift) {
                res.status(500).json({message: 'there is already a shift for this user'})
            } else {
                await prisma.shift.create({
                    data: {
                        user_id: user.id,
                        complete: false,
                        start: new Date(),
                        lat: lat,
                        lng: lng
                        //watttttttt
                    }
                })
                .then(shift => res.status(200).json(shift))
                .catch(err => res.status(500).json({message: err.message}))
            }
        }
    }

    if (method === "PATCH") {
        const { id } = req.body;
        await prisma.shift.update({
            data: {
                complete: true,
            },
            where: {
                id
            }
        })
        res.status(200).end();
    }


}

export default handler;