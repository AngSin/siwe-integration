import React, { useContext, useState, MouseEvent } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import {walletContext} from "../context/WalletContext";

const defaultMessage = 'Connect Wallet';

export const Page = () => {
	const [isOpen, toggleAccordion] = useState(false)
	const navigate = useNavigate();
	const outlet = useOutlet();
	const { wallet = defaultMessage, logout, signInWithEthereum } = useContext(walletContext);
	const disconnectWallet = async (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		logout();
		toggleAccordion(!isOpen);
	};

	return (
		<div className="h-screen">
			<div className="flex justify-between">
				<button className="bg-blue-600 text-3xl text-white" onClick={() => navigate('/')}>🏠Home</button>
				<div className="border rounded-lg overflow-hidden cursor-pointer">
					<div className="border-b">
						<button className="w-full text-left p-4 focus:outline-none" onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							if (wallet !== defaultMessage) {
								toggleAccordion(!isOpen)
							} else {
								signInWithEthereum();
							}
						}}>
							<span className="font-bold">{wallet}</span>
						</button>
						<div className={isOpen ? "cursor-pointer" : "p-4 hidden"} onClick={(e) => disconnectWallet(e)}>
							<p>Disconnect</p>
						</div>
					</div>
				</div>
			</div>
			{outlet}
		</div>
	);
};