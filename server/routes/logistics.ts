import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Get all logistics entries
router.get('/logistics', async (req, res) => {
  try {
    const logistics = await storage.getLogistics();
    res.json(logistics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get logistics by ID
router.get('/logistics/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const logistics = await storage.getLogisticsById(id);
    
    if (!logistics) {
      return res.status(404).json({ error: 'Logistics not found' });
    }
    
    res.json(logistics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get logistics by contract ID
router.get('/contracts/:contractId/logistics', async (req, res) => {
  try {
    const contractId = parseInt(req.params.contractId);
    const logistics = await storage.getLogisticsByContractId(contractId);
    res.json(logistics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get logistics by user ID
router.get('/users/:userId/logistics', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const logistics = await storage.getLogisticsByUserId(userId);
    res.json(logistics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all logistics providers
router.get('/logistics/providers', async (req, res) => {
  try {
    const providers = await storage.getLogisticsProviders();
    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get logistics provider by ID
router.get('/logistics/providers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const provider = await storage.getLogisticsProviderById(id);
    
    if (!provider) {
      return res.status(404).json({ error: 'Logistics provider not found' });
    }
    
    res.json(provider);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create logistics
router.post('/logistics', async (req, res) => {
  try {
    const { 
      type, 
      origin, 
      destination, 
      shipmentDate, 
      cargoType, 
      weight, 
      specialRequirements, 
      providerId, 
      trackingNumber,
      estimatedDelivery,
      userId,
      contractId,
      status,
      milestones 
    } = req.body;
    
    if (!type || !origin || !destination || !shipmentDate || !cargoType || !weight || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newLogistics = await storage.createLogistics({
      type,
      origin,
      destination,
      shipmentDate: new Date(shipmentDate),
      cargoType,
      weight,
      userId,
      specialRequirements: specialRequirements || null,
      providerId: providerId ? parseInt(providerId) : null,
      trackingNumber: trackingNumber || null,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      contractId: contractId || null,
      status: status || 'PENDING',
      milestones: milestones || null
    });
    
    res.status(201).json(newLogistics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update logistics
router.patch('/logistics/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const logistics = await storage.getLogisticsById(id);
    
    if (!logistics) {
      return res.status(404).json({ error: 'Logistics not found' });
    }
    
    // Convert date strings to Date objects
    if (req.body.shipmentDate) {
      req.body.shipmentDate = new Date(req.body.shipmentDate);
    }
    
    if (req.body.estimatedDelivery) {
      req.body.estimatedDelivery = new Date(req.body.estimatedDelivery);
    }
    
    // Convert provider ID string to number
    if (req.body.providerId) {
      req.body.providerId = parseInt(req.body.providerId);
    }
    
    const updatedLogistics = await storage.updateLogistics(id, req.body);
    res.json(updatedLogistics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Blockchain verification endpoint (mock)
router.get('/logistics/:id/verify', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const logistics = await storage.getLogisticsById(id);
    
    if (!logistics) {
      return res.status(404).json({ error: 'Logistics not found' });
    }
    
    // Mock blockchain verification response
    res.json({
      verified: true,
      logistics,
      blockchainData: {
        txHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        blockNumber: Math.floor(Math.random() * 1000000) + 10000000,
        timestamp: new Date(),
        network: 'Base Network',
        verifiedBy: ['0x7C4E46d9D576B32598Bc4D77A91Ad4a00B188Deb', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F']
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;