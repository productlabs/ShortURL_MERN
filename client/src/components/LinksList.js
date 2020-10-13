import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const LinksList = ({ links, updateLinksPage }) => {
  const { token } = useContext(AuthContext);
  const { request } = useHttp();
  const message = useMessage();

  const deleteLink = async (link_id) => {
    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await request(
        `/api/link/${link_id}`,
        "DELETE",
        null,
        headers
      );

      // If url deleted send message to the user and refresh the parent - LinksPage
      if (response.status === 204) {
        message(response.message);
        updateLinksPage(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!links || links.length === 0) {
    return <p className="center bold">No links yet.</p>;
  }
  return (
    <table className="striped">
      <thead>
        <tr>
          <th>N</th>
          <th>Original URL</th>
          <th>Short URL</th>
        </tr>
      </thead>
      <tbody>
        {links.map((link, index) => {
          return (
            <tr key={link._id}>
              <td>{index + 1}</td>
              <td>{link.originalUrl}</td>
              <td>{link.shortUrl}</td>
              <td>
                <Link to={`/detail/${link._id}`}>
                  <i className="material-icons icon">info_outline</i>
                </Link>
                <i
                  onClick={() => {
                    deleteLink(link._id);
                  }}
                  className="material-icons icon"
                >
                  delete_forever
                </i>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};