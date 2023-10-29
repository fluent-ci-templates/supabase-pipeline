import { gql } from "../../deps.ts";

export const deploy = gql`
  query Deploy($src: String!, $token: String!, $projectId: String!) {
    deploy(src: $src, token: $token, projectId: $projectId)
  }
`;
