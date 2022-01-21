import React, { useState } from 'react';
import Position from '../Position/Position';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  recalculatePositionsWithRenamedTeam,
  recalculateSwappedPositions,
} from './Positions';
import { SAMPLE_LEAGUE_TABLE } from './SampleData';
import { Card, Col } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { getSampleData } from '../../api/leagueTableApi';

const LeagueTable = () => {
  const [positions, setPositions] = useState(SAMPLE_LEAGUE_TABLE);

  const { isLoading, error } = useQuery('sampleData', getSampleData, {
    onSuccess: setPositions,
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'An error has occurred: ' + error.message;
  }

  const swapPositions = (sourceTeamId, targetTeamId) => {
    setPositions(
      recalculateSwappedPositions(sourceTeamId, targetTeamId, positions)
    );
  };

  const updateTeamname = (team, updatedText) => {
    setPositions(
      recalculatePositionsWithRenamedTeam(team, updatedText, positions)
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Col md={6}>
        <Card bg="dark">
          <Card.Header role={'heading'}>
            <Card.Title>Ligatabelle zum Selberstecken</Card.Title>
          </Card.Header>
          <Card.Body>
            {positions.map((team, index) => (
              <Position
                team={team}
                rank={index + 1}
                key={index}
                swapPositions={swapPositions}
                updateTeamname={updateTeamname}
              />
            ))}
          </Card.Body>
        </Card>
      </Col>
    </DndProvider>
  );
};

export default LeagueTable;
