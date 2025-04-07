const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-center mb-8">About StudySphere</h2>

      <p className="text-gray-700 text-lg mb-10 text-center">
        StudySphere is a modern collaborative learning platform built to connect
        students, promote knowledge sharing, and create a strong academic
        community. We believe that learning thrives in environments where ideas
        are exchanged freely, resources are accessible to all, and collaboration
        is at the heart of growth.
      </p>

      <div className="space-y-10">
        <section>
          <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
          <p className="text-gray-600 leading-relaxed">
            At StudySphere, we envision a future where students take charge of
            their education by working together. Traditional course-based
            platforms often limit creativity and interaction. We aim to break
            those barriers and provide a space where learners from around the
            world can connect, share knowledge, and collaborate without
            restrictions.
            <br />
            <br />
            We believe learning should be dynamic, inclusive, and constantly
            evolving — just like the students who drive it.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-3">What We Offer</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            StudySphere is more than just a file-sharing tool. It's a complete
            ecosystem designed to empower students with features like:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <strong>Resource Sharing:</strong> Upload and access study notes,
              presentations, research papers, and important academic resources
              anytime.
            </li>
            <li>
              <strong>Study Groups:</strong> Form study circles based on
              subjects, exams, or interests to collaborate effectively with
              like-minded peers.
            </li>
            <li>
              <strong>Live Collaboration:</strong> Work together on documents,
              projects, or brainstorming sessions in real-time, from anywhere in
              the world.
            </li>
            <li>
              <strong>Discussion Forums:</strong> Engage in thoughtful
              conversations, solve doubts, and share academic insights in an
              open and supportive environment.
            </li>
            <li>
              <strong>Community Growth:</strong> Participate in challenges,
              contribute to shared knowledge pools, and build your academic
              network organically.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-3">Our Story</h3>
          <p className="text-gray-600 leading-relaxed">
            StudySphere was founded by a group of students who realized that
            true learning often happens outside the traditional classroom.
            Frustrated with limited access to good resources and the lack of
            collaborative tools, they set out to create a platform that
            reflected the real needs of modern learners.
            <br />
            <br />
            Today, StudySphere continues to grow as a student-first platform,
            driven by feedback from the community and a passion for improving
            the way students learn and connect.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to democratize education by making it more
            accessible, collaborative, and empowering for students everywhere.
            We want to foster an environment where learning is a shared journey,
            driven by community, curiosity, and collaboration.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-3">Join Us</h3>
          <p className="text-gray-600 leading-relaxed">
            Whether you're preparing for an exam, working on a group project, or
            simply seeking to deepen your understanding of a topic, StudySphere
            is here for you. Join our community today and become part of a
            movement that's redefining the future of education — together.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
