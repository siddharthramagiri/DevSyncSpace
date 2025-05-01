import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma"; 

const getTeams = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
        projects: true,
      },
    });

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

export default getTeams;
