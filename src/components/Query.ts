export const fetchNft = async (walletAddress: string, setNfts: any, user: any, inputAddress: any) => {
    try {
        const owner = inputAddress
            ? inputAddress
            : user?.wallet_address
                ? user?.wallet_address
                : walletAddress

        const apiKey = process.env.REACT_APP_ALCHEMY_KEY;

        fetch(`https://polygon-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs?owner=${owner}&contractAddresses[]=0x2953399124f0cbb46d2cbacd8a89cf0599974963,0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f`)
            .then((response) => response.json())
            .then(async (res) => {

            const promisesArr1: any = []
            const promisesArr2: any = []
            const newArray:any = [];

            let nftCount = 0;
            res.ownedNfts.map(async (item: any) => {
                if (nftCount >= 24) return
                if (item.title === 'empty' || item.title === '') {
                    promisesArr1.push(fetch(item?.tokenUri?.gateway))
                }
                else {
                    newArray.push({ ...item.metadata,
                        image: item.metadata.image ? item.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/') : item.metadata.image_url.replace('ipfs://', 'https://ipfs.io/ipfs/')
                    })
                }
                nftCount++
            })

            const resultPromises1 = await Promise.all(promisesArr1);
                resultPromises1.map((x)=>{
                promisesArr2.push(x.json());
            });

            const resArr = await Promise.all(promisesArr2);

            resArr.map((item)=>{
                if(item.image){
                    item.image = item.image.replace("ipfs://", "https://ipfs.io/ipfs/")
                    newArray.push(item);
                }
            });
            setNfts((prev: string[]) => [...prev, newArray])
        });
    } catch (err) {
        console.log(err)
    }
}
