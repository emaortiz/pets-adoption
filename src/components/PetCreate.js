import { Row, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { ethers } from 'ethers';
import {Buffer} from 'buffer';
import { create } from 'ipfs-http-client';

const INFURA_ID = '2VLsbcj7RQw0I1YkMv0l7RfNcUm';
const INFURA_SECRET_KEY = '1170cc655662bce32e17d5ca8a9e85ec';
const auth =
    'Basic ' + Buffer.from(INFURA_ID + ':' + INFURA_SECRET_KEY).toString('base64');
const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

export function PetCreate () {
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [breed, setBreed] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file);
                console.log(result);
                const url = `https://petadoption.infura-ipfs.io/ipfs/${result.path}`
                setImage(`${url}`);
            } catch (error) {
                console.log("ipfs image upload error: ", error);
            }
        }
    }

    const createNFT = async () => {
        if (!image || !age || !name || !breed || !location || !description) return
        try {
            const result = await client.add(JSON.stringify({ image, age, name, breed, location, description }));
            // mintThenList(result);
            console.log(result);
        } catch (error) {
            console.log("ipfs uri uload error: ", error);
        }
    }


    return (
        <div className="container">
            <main role="main" className='col-lg-12 mx-auto' style={{ maxWidth: '1000px' }}>
                    <div className='content mx-auto'>
                        <Row className='g-4'>
                            <Form.Control
                                type="file"
                                required
                                name="file"
                                onChange={uploadToIPFS} />
                            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                            <Form.Control onChange={(e) => setAge(e.target.value)} size="lg" required type="number" placeholder='Age' />
                            <Form.Control onChange={(e) => setBreed(e.target.value)} size="lg" required type="text" placeholder='Breed' />
                            <Form.Control onChange={(e) => setLocation(e.target.value)} size="lg" required type="text" placeholder='Location' />
                            <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description"/>
                            <div className='g-grid px-0'>
                                <Button onClick={createNFT} variant="primary" size="lg">
                                    Create NFT!
                                </Button>
                            </div>
                        </Row>
                    </div>
            </main>
        </div>
    );
}