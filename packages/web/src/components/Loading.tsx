import React from "react";
import styled from "@emotion/styled";

const SPEED = 2;
export const Loading = styled.div`
  /**
 * ==============================================
 * Dot Flashing
 * ==============================================
 */

  position: relative;
  width: 10px;
  height: 10px;
  // border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.05);
  animation: dotFlashing ${SPEED}s infinite normal;
  animation-delay: ${SPEED / 3}s;

  &::before,
  &::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &::before {
    left: -15px;
    width: 10px;
    height: 10px;
    //border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.05);
    animation: dotFlashing ${SPEED}s infinite normal;
    animation-delay: 0s;
  }

  &::after {
    left: 15px;
    width: 10px;
    height: 10px;
    // border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.05);
    animation: dotFlashing ${SPEED}s infinite normal;
    animation-delay: ${(SPEED / 3) * 2}s;
  }

  @keyframes dotFlashing {
    0%,
    50%,
    100% {
      background-color: rgba(0, 0, 0, 0.05);
    }
    80% {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
`;
