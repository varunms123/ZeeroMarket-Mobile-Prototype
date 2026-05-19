import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    isApproved: boolean;
    isAuction? :boolean;
    highestBid: number;
    highestBidder: string;
    endTime?: string;
}

export interface Auction {
    id: string;
    title: string;
    description: string;
    currentBid: number;
    highestBidder: string;
    endsAt: number;
    isApproved: boolean;
}

interface DataState {
    products: Product[];
    auctions: Auction[];
}

const initialState: DataState = {
    products: [
        {
            id: '1',
            title: 'Enterprise Server Rack v2',
            description: 'High performance processing layout chassis for server clusters.',
            price: 45000,
            image: 'https://via.placeholder.com/150',
            isApproved: true,
            isAuction: false,
            highestBid: 0,
            highestBidder: ''
        },
        {
            id: '2',
            title: 'Vintage Mechanical Watch',
            description: '1970s limited collector edition chronograph timepiece.',
            price: 12000,
            image: 'https://via.placeholder.com/150',
            isApproved: true,
            isAuction: true,
            highestBid: 13500,
            highestBidder: 'buyer@test.com',
            endTime: new Date(Date.now() + 600000).toISOString()
        },
        {
            id: '3',
            title: 'Bulk Premium Copper Coils',
            description: '工业用高纯度铜线圈. 500kg lot ready for industrial allocation logistics.',
            price: 85000,
            image: 'https://via.placeholder.com/150',
            isApproved: false,
            highestBid: 0,
            highestBidder: ''
        }
    ],
    auctions: [
        { 
            id: 'a1', 
            title: 'Vintage Leather Jacket', 
            description: 'Rare collector piece from the late 1990s.', 
            currentBid: 5000, 
            highestBidder: 'admin@zeero.com', 
            endsAt: Date.now() + 600000,
            isApproved: true 
        },
        { 
            id: 'a2', 
            title: 'PlayStation 5 Console', 
            description: 'Barely used console bundle with 2 wireless controllers.', 
            currentBid: 32000, 
            highestBidder: 'buyer@zeero.com', 
            endsAt: Date.now() + 3600000,
            isApproved: false
        },
    ],
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Omit<Product, 'id' | 'isApproved'>>) => {
            const newProduct: Product = {
                ...action.payload,
                id: Math.random().toString(),
                isApproved: false,
            };
            state.products.push(newProduct);
        },
        addAuction: (state, action: PayloadAction<Omit<Auction, 'id' | 'isApproved'>>) => {
            const newAuction: Auction = {
                ...action.payload,
                id: 'a_' + Math.random().toString(),
                isApproved: false,
            };
            state.auctions.push(newAuction);
        },
        approveProduct: (state, action: PayloadAction<string>) => {
            const product = state.products.find(p => p.id === action.payload);
            if (product) {
                product.isApproved = true;
                return;
            }
            const auction = state.auctions.find(a => a.id === action.payload);
            if (auction) auction.isApproved = true;
        },
        rejectProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
            state.auctions = state.auctions.filter(a => a.id !== action.payload);
        },
        placeBidSuccess: (state, action: PayloadAction<{ auctionId: string; amount: number; userEmail: string}>) => {
            const auction = state.auctions.find(a => a.id === action.payload.auctionId);
            if (auction) {
                auction.currentBid = action.payload.amount;
                auction.highestBidder = action.payload.userEmail;
            }
        },
    },
});

export const { addProduct, approveProduct, rejectProduct, placeBidSuccess, addAuction } = dataSlice.actions;
export default dataSlice.reducer;