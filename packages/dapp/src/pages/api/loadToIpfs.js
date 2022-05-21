import { NFTStorage, File, Blob } from 'nft.storage'

const NFT_STORAGE_TOKEN  = process.env.NEXT_PUBLIC_NFTSTORAGE_TOKEN

const clientipfsnftstorage = new NFTStorage({ token: NFT_STORAGE_TOKEN })

export default function handler(req, res) {
    if (req.method === 'POST') {
      // Process a POST request
    } else {
      // Handle any other HTTP method
    }
  }