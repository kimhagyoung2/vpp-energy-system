import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PowerPlant, VPPOperation, StatsData } from '../App';
import { WS_URL } from '../config/api';
import io from 'socket.io-client';

// ... existing code ...

  useEffect(() => {
    const newSocket = io(WS_URL);

// ... existing code ... 